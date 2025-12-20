package tests

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/Stephen10121/infosections/webhooks"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type UserSubscribedBody struct {
	Id           string `json:"id"`
	RefreshToken string `json:"refreshToken"`
}

// This is a test function that can create a webhook enpoint from the planning center dev page.
func CreateWebhook(e *core.ServeEvent, base *pocketbase.PocketBase) {
	e.Router.POST("/tester", func(e *core.RequestEvent) error {
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

		record, err := base.FindFirstRecordByFilter(
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

		webhookResp, err := webhooks.CreateWebhookPlanningCenter(record.Id, base, "calendar.v2.events.event_request.created")

		if err != nil {
			base.Logger().Error(
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
}
