package planningcenter

type EventItselfAttributes struct {
	ApprovalStatus       string `json:"approval_status"`
	CreatedAt            string `json:"created_at"`
	Description          string `json:"description"`
	Featured             bool   `json:"featured"`
	ImageUrl             string `json:"image_url"`
	Name                 string `json:"name"`
	PercentApproved      int    `json:"percent_approved"`
	PercentRejected      int    `json:"percent_rejected"`
	RegistrationURL      any    `json:"registration_url"`
	Summary              string `json:"summary"`
	UpdatedAt            string `json:"updated_at"`
	VisibleInChuchCenter bool   `json:"visible_in_church_center"`
}

type EventItself struct {
	Type       string                `json:"type"`
	Id         string                `json:"id"`
	Attributes EventItselfAttributes `json:"attributes"`
}

func RestructureEvent(included IncludedType) (EventItself, bool) {
	approvalStatus, ok := included.Attributes["approval_status"].(string)
	if !ok {
		return EventItself{}, false
	}

	createdAt, ok := included.Attributes["created_at"].(string)
	if !ok {
		return EventItself{}, false
	}

	description, ok := included.Attributes["description"].(string)
	if !ok {
		description = ""
	}

	featured, ok := included.Attributes["featured"].(bool)
	if !ok {
		return EventItself{}, false
	}

	imageUrl, ok := included.Attributes["image_url"].(string)
	if !ok {
		imageUrl = ""
	}

	name, ok := included.Attributes["name"].(string)
	if !ok {
		return EventItself{}, false
	}

	percentApproved, ok := included.Attributes["percent_approved"].(float64)
	if !ok {
		return EventItself{}, false
	}

	percentRejected, ok := included.Attributes["percent_rejected"].(float64)
	if !ok {
		return EventItself{}, false
	}

	registrationURL, ok := included.Attributes["registration_url"]
	if !ok {
		return EventItself{}, false
	}

	summary, ok := included.Attributes["summary"].(string)
	if !ok {
		summary = ""
	}

	updatedAt, ok := included.Attributes["updated_at"].(string)
	if !ok {
		return EventItself{}, false
	}

	visibleInChuchCenter, ok := included.Attributes["visible_in_church_center"].(bool)
	if !ok {
		return EventItself{}, false
	}

	newEvent := EventItself{
		Type: included.Type,
		Id:   included.Id,
		Attributes: EventItselfAttributes{
			ApprovalStatus:       approvalStatus,
			CreatedAt:            createdAt,
			Description:          description,
			Featured:             featured,
			ImageUrl:             imageUrl,
			Name:                 name,
			PercentApproved:      int(percentApproved),
			PercentRejected:      int(percentRejected),
			RegistrationURL:      registrationURL,
			Summary:              summary,
			UpdatedAt:            updatedAt,
			VisibleInChuchCenter: visibleInChuchCenter,
		},
	}

	return newEvent, true
}

func ParseEventItself(eventRelationship EventRelationship, allEvents []EventItself) (EventItselfAttributes, bool) {
	for _, event := range allEvents {
		if event.Id == eventRelationship.Data.Id {
			return event.Attributes, true
		}
	}

	return EventItselfAttributes{}, false
}
