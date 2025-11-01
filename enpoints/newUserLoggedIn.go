package enpoints

import (
	"encoding/json"
	"io"

	"github.com/Stephen10121/tailorcalbackend/functions"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type UserLoggedInBody = UserSubscribedBody

// Whenever the user just subscribed to a payment plan. This enpoint triggers to initialize the "benefits" haha
func NewUserLoggedIn(e *core.ServeEvent, base *pocketbase.PocketBase) {
	e.Router.POST("/newUser", func(c *core.RequestEvent) error {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			return c.JSON(500, map[string]string{
				"msg": "Failed to read the body!",
			})
		}

		bodyStruct := UserLoggedInBody{}
		err = json.Unmarshal(body, &bodyStruct)
		if err != nil {
			return c.JSON(500, map[string]string{
				"msg": "Failed to read the body!",
			})
		}

		if len(bodyStruct.Id) == 0 {
			return c.JSON(400, map[string]string{
				"msg": "Missing data in the body!",
			})
		}

		if len(bodyStruct.RefreshToken) == 0 {
			return c.JSON(400, map[string]string{
				"msg": "Missing data in the body!",
			})
		}

		record, err := base.FindFirstRecordByFilter(
			"users",
			"id = {:theId} && refreshToken = {:refreshedToken}",
			dbx.Params{"theId": bodyStruct.Id, "refreshedToken": bodyStruct.RefreshToken},
		)
		if err != nil {
			return c.JSON(401, map[string]string{
				"msg": "Unauthorized!",
			})
		}

		if record.GetString("accessLevel") == "none" {
			return c.JSON(401, map[string]string{
				"msg": "Unauthorized!",
			})
		}

		functions.GetAndStoreNextThreeEvents(record.Id, base)

		return c.JSON(200, map[string]string{
			"msg": "ok",
		})
	})
}
