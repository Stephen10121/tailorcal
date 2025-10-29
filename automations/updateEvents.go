package automations

import (
	"fmt"

	"github.com/Stephen10121/tailorcalbackend/functions"
	"github.com/pocketbase/pocketbase"
)

// This function gets called every 12 hours and it just fetches the events for any user that is subscribed.
func UpdateEventInstances(app *pocketbase.PocketBase) {
	app.Logger().Info("Updating the event instances for every subscribed user.")
	users, err := app.FindAllRecords("users")

	if err != nil {
		app.Logger().Error(
			"Failed to fetch all 'users' records",
			"error", err,
		)
		return
	}
	fmt.Println(users)
	for i := 0; i < len(users); i++ {
		if users[i].GetRaw("accessLevel") != "none" {
			app.Logger().Info(
				"Fetching event data for user.",
				"user", users[i].GetString("name"),
			)
			functions.GetAndStoreNextThreeEvents(users[i].Id, app)
		}
	}
}
