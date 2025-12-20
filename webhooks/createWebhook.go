package webhooks

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Stephen10121/infosections/initializers"
	"github.com/Stephen10121/infosections/planningcenter"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type Attributs struct {
	Name   string `json:"name"`
	Url    string `json:"url"`
	Active bool   `json:"active"`
}

type Data2 struct {
	Attributues Attributs `json:"attributes"`
}

type CreateWebhookBody struct {
	Data Data2 `json:"data"`
}

func CreateWebhookPlanningCenter(userId string, app *pocketbase.PocketBase, webhookName string) ([]byte, error) {
	collection, err := app.FindCollectionByNameOrId("webhooks")
	if err != nil {
		return nil, err
	}

	webhookRecord := core.NewRecord(collection)

	webhookRecord.Set("owner", userId)
	webhookRecord.Set("name", webhookName)
	webhookRecord.Set("active", true)
	webhookRecord.Set("hits", 0)

	err = app.Save(webhookRecord)
	if err != nil {
		return nil, err
	}

	requestBody := CreateWebhookBody{
		Data: Data2{
			Attributues: Attributs{
				Name:   webhookName,
				Url:    initializers.HostName + "/webhook/" + webhookRecord.Id,
				Active: true,
			},
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	fmt.Println(string(jsonData))

	resBody, err := planningcenter.SendAPICall(
		http.MethodPost,
		"https://api.planningcenteronline.com/webhooks/v2/subscriptions",
		bytes.NewBuffer(jsonData),
		userId,
		app,
	)

	if err != nil {
		return nil, err
	}

	return resBody, nil
}
