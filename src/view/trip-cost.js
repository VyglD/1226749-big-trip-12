const getTotalTripCost = (tripEvents) => {
  let totalTripCost = 0;

  for (const tripEvent of tripEvents) {
    totalTripCost += tripEvent.price;

    for (const offer of tripEvent.offers) {
      totalTripCost += offer.cost;
    }
  }

  return totalTripCost;
};

export const createTripCostTemplate = (tripEvents) => {
  const totalCost = getTotalTripCost(tripEvents);

  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>`
  );
};
