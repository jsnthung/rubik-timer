const EventSelector = ({ selectedEvent, setSelectedEvent, events }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1 text-gray-300">
      Select Event
    </label>
    <select
      className="w-full bg-gray-800 text-white px-3 py-2 rounded-md"
      value={selectedEvent}
      onChange={(e) => setSelectedEvent(e.target.value)}
    >
      {Object.entries(events).map(([key, { eventName }]) => (
        <option key={key} value={key}>
          {eventName}
        </option>
      ))}
    </select>
  </div>
);

export default EventSelector;
