package planningcenter

import (
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase"
)

// This function will go to the planning center api. If the access token has expired, the function will fetch a new one and retry the api call.
func SendAPICall(method string, endpointURL string, body io.Reader, userId string, app *pocketbase.PocketBase) ([]byte, error) {
	log.Println("Calling an api endpoint at planningcenter.")

	record, err := app.FindRecordById("users", userId)
	if err != nil {
		return nil, errors.New("user doesnt exist.")
	}

	// These next lines check if the current access token is valid or not. If not, we will fetch a new one.
	now := time.Now()
	accessTokenExpires := record.GetDateTime("accessTokenExpires").Time()
	tokenExpired := accessTokenExpires.Sub(now).Seconds() < 10

	if tokenExpired {
		err = NewAccessToken(app, userId)
		if err != nil {
			return nil, err
		}

		record, err = app.FindRecordById("users", userId)
		if err != nil {
			return nil, errors.New("user doesnt exist.")
		}
	}

	req, err := http.NewRequest(
		method,
		endpointURL,
		body,
	)
	fmt.Println(record.GetString("authToken"))
	req.Header.Add("Authorization", "Bearer "+record.GetString("authToken"))

	if err != nil {
		return nil, err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return io.ReadAll(res.Body)
}
