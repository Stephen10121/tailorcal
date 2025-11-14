package functions

import (
	"encoding/json"
	"fmt"

	"github.com/Stephen10121/tailorcalbackend/planningcenter"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func GetAndStoreNextThreeEvents(userId string, app *pocketbase.PocketBase) {
	events, err := planningcenter.EventFetcher(userId, app)

	if err != nil {
		app.Logger().Error(
			"Failed to fetch event instance data from planning center.",
			"id", userId,
			"error", err,
		)
		return
	}

	collection, err := app.FindCollectionByNameOrId("events")
	if err != nil {
		app.Logger().Warn("Create the users collection to save the data fetched from the planning center api!")
		return
	}

	for i := 0; i < len(events); i++ {
		times, err := json.Marshal(events[i].Times)
		if err != nil {
			fmt.Println(err)
			continue
		}

		resources, err := json.Marshal(events[i].Resources)
		if err != nil {
			fmt.Println(err)
			continue
		}

		tags, err := json.Marshal(events[i].Tags)
		if err != nil {
			fmt.Println(err)
			continue
		}

		existingRecord, err := app.FindRecordById("events", events[i].InstanceId)

		if err != nil {
			newEventRecord := core.NewRecord(collection)
			newEventRecord.Set("id", events[i].InstanceId)
			newEventRecord.Set("startTime", events[i].StartTime)
			newEventRecord.Set("endTime", events[i].EndTime)
			newEventRecord.Set("name", events[i].Name)
			newEventRecord.Set("location", events[i].Location)
			newEventRecord.Set("times", times)
			newEventRecord.Set("resources", resources)
			newEventRecord.Set("tags", tags)
			newEventRecord.Set("owner", userId)
			newEventRecord.Set("description", events[i].Description)
			newEventRecord.Set("imageURL", events[i].ImageURL)

			if err := app.Save(newEventRecord); err != nil {
				app.Logger().Error(
					"Failed save a record to events.",
					"id", userId,
					"eventInstanceId", events[i].InstanceId,
					"error", err,
				)
				continue
			}
		} else {
			existingRecord.Set("startTime", events[i].StartTime)
			existingRecord.Set("endTime", events[i].EndTime)
			existingRecord.Set("name", events[i].Name)
			existingRecord.Set("location", events[i].Location)
			existingRecord.Set("times", times)
			existingRecord.Set("resources", resources)
			existingRecord.Set("tags", tags)
			existingRecord.Set("description", events[i].Description)
			existingRecord.Set("imageURL", events[i].ImageURL)

			if err := app.Save(existingRecord); err != nil {
				app.Logger().Error(
					"Failed save a record to events.",
					"id", userId,
					"eventInstanceId", events[i].InstanceId,
					"error", err,
				)
				continue
			}
		}
	}

	return
}
