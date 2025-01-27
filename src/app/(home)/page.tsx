import React from "react";

const HomePage = () => {
  return (
    <div className="p-4">
      {/* Welcome Section */}


      {/* Upcoming Appointment */}
      <div className="mb-4 p-4 border rounded-lg shadow-sm">
        <h2 className="text-base font-bold">Upcoming Appointment</h2>
        <p className="text-sm">Dr. Amanda Shaw</p>
        <p className="text-sm text-gray-500">Today at 10:00am EST</p>
        <button className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-md">
          Join Call
        </button>
      </div>

      {/* Progress Section */}
      <div className="p-4 border rounded-lg shadow-sm">
        <h2 className="text-base font-bold">Your Progress</h2>
        <ul className="text-sm space-y-2">
          <li>✔️ Stage assessment completed</li>
          <li>✔️ Daily symptom tracking</li>
          <li>⬜ First professional consult booked</li>
          <li>⬜ Read an article</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
