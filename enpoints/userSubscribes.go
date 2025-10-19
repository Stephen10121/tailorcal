package enpoints

import (
	"encoding/json"
	"io"

	"github.com/Stephen10121/tailorcalbackend/functions"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type UserSubscribedBody struct {
	Id string `json:"id"`
}

// Whenever the user just subscribed to a payment plan. This enpoint triggers to initialize the "benefits" haha
func UserHasSubscribed(e *core.ServeEvent, base *pocketbase.PocketBase) {
	e.Router.POST("/userSubscribed", func(c *core.RequestEvent) error {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			return c.JSON(500, map[string]string{
				"msg": "Failed to read the body!",
			})
		}

		bodyStruct := UserSubscribedBody{}
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

		record, err := base.FindRecordById("users", bodyStruct.Id)
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
