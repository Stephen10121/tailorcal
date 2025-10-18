package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

		return se.Next()
	})

	app.Cron().MustAdd("testCronJob", "*/1 * * * *", func() {
		log.Println("Testing the cron job")
		app.Logger().Info(
			"Info message test just because",
			"name", "Stephen Gruzin",
			"id", 101,
		)
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
