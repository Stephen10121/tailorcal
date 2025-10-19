package main

import (
	"log"

	"github.com/Stephen10121/tailorcalbackend/automations"
	"github.com/Stephen10121/tailorcalbackend/enpoints"
	"github.com/Stephen10121/tailorcalbackend/initializers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	initializers.SetupEnv()
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		enpoints.UserHasSubscribed(se, app)

		return se.Next()
	})

	app.Cron().MustAdd("updateEventInstancesForEachSubscribedUser", "0 */12 * * *", func() {
		automations.UpdateEventInstances(app)
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
