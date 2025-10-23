package initializers

import (
	"log"
	"os"
)

var PlanningCenterClientId string
var PlanningCenterClientSecret string
var HostName string

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

	hostName := os.Getenv("HOST_NAME")

	if len(hostName) != 0 {
		HostName = hostName
	} else {
		log.Fatalln("HOST_NAME env variable is not set.")
	}
}
