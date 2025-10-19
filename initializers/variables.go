package initializers

import (
	"log"
	"os"
)

var PlanningCenterClientId string
var PlanningCenterClientSecret string

func SetupEnv() {
	clientId := os.Getenv("PLANNINGCENTER_CLIENT_ID")

	if len(clientId) != 0 {
		PlanningCenterClientId = clientId
	} else {
		log.Fatalln("PLANNINGCENTER_CLIENT_ID env variable is not set.")
	}

	clientSecret := os.Getenv("PLANNINGCENTER_CLIENT_SECRET")

	if len(clientSecret) != 0 {
		PlanningCenterClientSecret = clientSecret
	} else {
		log.Fatalln("PLANNINGCENTER_CLIENT_SECRET env variable is not set.")
	}
}
