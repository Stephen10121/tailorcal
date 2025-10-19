package planningcenter

import (
	"encoding/json"
	"net/http"

	"github.com/pocketbase/pocketbase"
)

type ResourceJsonType struct {
	Type       string `json:"type"`
	Id         string `json:"id"`
	Attributes struct {
		CreatedAt    string         `json:"created_at"`
		Description  any            `json:"description"`
		ExpiresAt    any            `json:"expires_at"`
		HomeLocation any            `json:"home_location"`
		Image        map[string]any `json:"image"`
		Kind         string         `json:"kind"`
		Name         string         `json:"name"`
		PathName     string         `json:"path_name"`
		Quantity     int            `json:"quantity"`
		SerialNumber any            `json:"serial_number"`
		UpdatedAt    string         `json:"updated_at"`
	} `json:"attributes"`
	Links map[string]any `json:"links"`
}

type ResourcesFetchResponse struct {
	Data []ResourceJsonType `json:"data"`
}

func FetchResources(userId string, app *pocketbase.PocketBase) ([]ResourceJsonType, error) {
	resBody, err := SendAPICall(
		http.MethodGet,
		"https://api.planningcenteronline.com/calendar/v2/resources",
		nil,
		userId,
		app,
	)

	if err != nil {
		return []ResourceJsonType{}, err
	}

	var responseJson ResourcesFetchResponse

	err = json.Unmarshal([]byte(resBody), &responseJson)

	if err != nil {
		return []ResourceJsonType{}, err
	}

	return responseJson.Data, nil
}
