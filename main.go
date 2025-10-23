package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"

	"github.com/Stephen10121/tailorcalbackend/automations"
	"github.com/Stephen10121/tailorcalbackend/enpoints"
	"github.com/Stephen10121/tailorcalbackend/initializers"
	"github.com/Stephen10121/tailorcalbackend/webhooks"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type UserSubscribedBody struct {
	Id           string `json:"id"`
	RefreshToken string `json:"refreshToken"`
}

func main() {
	initializers.SetupEnv()
	app := pocketbase.New()

	log.Println(initializers.HostName)

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		enpoints.UserHasSubscribed(se, app)
		webhooks.HandleWebhookEndpoint(se, app)

		se.Router.POST("/tester", func(e *core.RequestEvent) error {
			body, err := io.ReadAll(e.Request.Body)
			if err != nil {
				return e.JSON(500, map[string]string{
					"msg": "Failed to read the body!",
				})
			}

			bodyStruct := UserSubscribedBody{}
			err = json.Unmarshal(body, &bodyStruct)
			if err != nil {
				return e.JSON(500, map[string]string{
					"msg": "Failed to read the body!",
				})
			}

			if len(bodyStruct.Id) == 0 {
				return e.JSON(400, map[string]string{
					"msg": "Missing data in the body!",
				})
			}

			if len(bodyStruct.RefreshToken) == 0 {
				return e.JSON(400, map[string]string{
					"msg": "Missing data in the body!",
				})
			}

			record, err := app.FindFirstRecordByFilter(
				"users",
				"id = {:theId} && refreshToken = {:refreshedToken}",
				dbx.Params{"theId": bodyStruct.Id, "refreshedToken": bodyStruct.RefreshToken},
			)
			if err != nil {
				return e.JSON(401, map[string]string{
					"msg": "Unauthorized!",
				})
			}

			if record.GetString("accessLevel") == "none" {
				return e.JSON(401, map[string]string{
					"msg": "Unauthorized!",
				})
			}

			webhookResp, err := webhooks.CreateWebhookPlanningCenter(record.Id, app, "calendar.v2.events.event_request.created")

			if err != nil {
				app.Logger().Error(
					"Failed to subscribe a webhook.",
					"error", err,
				)
				return e.JSON(401, map[string]string{
					"msg": err.Error(),
				})
			}

			fmt.Println(string(webhookResp))

			return e.JSON(200, map[string]string{
				"msg": string(webhookResp),
			})
		})

		return se.Next()
	})

	app.Cron().MustAdd("updateEventInstancesForEachSubscribedUser", "0 */12 * * *", func() {
		automations.UpdateEventInstances(app)
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
