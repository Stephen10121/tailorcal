package webhooks

import (
	"net/http"

	"github.com/Stephen10121/infosections/planningcenter"
	"github.com/pocketbase/pocketbase"
)

func GetAllWebhookPlanningCenter(userId string, app *pocketbase.PocketBase) ([]byte, error) {
	resBody, err := planningcenter.SendAPICall(
		http.MethodGet,
		"https://api.planningcenteronline.com/webhooks/v2/subscriptions",
		nil,
		userId,
		app,
	)

	if err != nil {
		return nil, err
	}

	return resBody, nil
}
