package planningcenter

type EventTimeAttributes struct {
	EndsAt                 string `json:"ends_at"`
	Name                   string `json:"name"`
	StartsAt               string `json:"starts_at"`
	VisibleOnKiosks        bool   `json:"visible_on_kiosks"`
	VisibleOnWidgetAndIcal bool   `json:"visible_on_widget_and_ical"`
}

type EventTime struct {
	Type       string              `json:"type"`
	Id         string              `json:"id"`
	Attributes EventTimeAttributes `json:"attributes"`
}

func RestructureEventTime(included IncludedType) (EventTime, bool) {
	endsAt, ok := included.Attributes["ends_at"].(string)
	if !ok {
		return EventTime{}, false
	}

	name, ok := included.Attributes["name"].(string)
	if !ok {
		return EventTime{}, false
	}

	startsAt, ok := included.Attributes["starts_at"].(string)
	if !ok {
		return EventTime{}, false
	}

	visibleOnKiosks, ok := included.Attributes["visible_on_kiosks"].(bool)
	if !ok {
		return EventTime{}, false
	}

	visibleOnWidgetAndIcal, ok := included.Attributes["visible_on_widget_and_ical"].(bool)
	if !ok {
		return EventTime{}, false
	}

	newEvent := EventTime{
		Type: included.Type,
		Id:   included.Id,
		Attributes: EventTimeAttributes{
			EndsAt:                 endsAt,
			Name:                   name,
			StartsAt:               startsAt,
			VisibleOnKiosks:        visibleOnKiosks,
			VisibleOnWidgetAndIcal: visibleOnWidgetAndIcal,
		},
	}

	return newEvent, true
}

func ParseEventTimes(eventTimesRelationship EventTimesRelationship, allEventTimes []EventTime) []SpecificEventTimes {
	eventTimes := []SpecificEventTimes{}

	for i := 0; i < len(eventTimesRelationship.Data); i++ {
		for _, aEventTime := range allEventTimes {
			if eventTimesRelationship.Data[i].Id == aEventTime.Id {
				eventTimes = append(eventTimes, SpecificEventTimes{
					Name:      aEventTime.Attributes.Name,
					StartTime: aEventTime.Attributes.StartsAt,
					EndTime:   aEventTime.Attributes.EndsAt,
				})
				break
			}
		}
	}

	return eventTimes
}
