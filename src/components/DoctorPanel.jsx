import React, { useState } from 'react';

function DoctorPanel() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentError, setAppointmentError] = useState(null);

  // Open modal & fetch appointments
  const openModal = () => {
    setIsModalOpen(true);
    fetchAppointments();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAppointments([]);
    setAppointmentError(null);
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    setAppointmentError(null);
    try {
      console.log("FETCHED")
      let name = "hii"
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        name = userData.name
        
      }
      console.log(name)
      const response = await fetch('https://serving-ninjas.onrender.com/appointment/by-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctor_name: name }),  // You can make this dynamic as needed
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      console.log(data)
      setAppointments(data);
    } catch (error) {
      setAppointmentError(error.message);
    } finally {
      setLoadingAppointments(false);
    }
  };



  const [form, setForm] = useState({
    center_name: '',
    doctor_name: '',
    address: '',
    phone: '',
    city: '',
    speciality: '',
    slots: [
      { start_time: '', end_time: '' }
    ]
  });
  
 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotChange = (idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newSlots = prev.slots.map((slot, sidx) =>
        sidx === idx ? { ...slot, [name]: value } : slot
      );
      return { ...prev, slots: newSlots };
    });
  };

  const addSlot = () => {
    setForm((prev) => ({
      ...prev,
      slots: [...prev.slots, { start_time: '', end_time: '' }]
    }));
  };

  const removeSlot = (idx) => {
    setForm((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, sidx) => sidx !== idx)
    }));
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    // Backend integration will be added later
    try {
    const response = await fetch('https://serving-ninjas.onrender.com/doctor/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Something went wrong');
    }

    const result = await response.json();
    alert('Doctor registered successfully!');
    console.log('API response:', result);

    // Optional: Reset the form
    setForm({
      center_name: '',
      doctor_name: '',
      address: '',
      phone: '',
      city: '',
      speciality: '',
      slots: [{ start_time: '', end_time: '' }],
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to register doctor: ' + error.message);
  }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={openModal}
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Open Appointments
        </button>

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Doctor Panel</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Center Name</label>
              <input
                type="text"
                name="center_name"
                value={form.center_name}
                onChange={handleChange}
                required
                className="text-black w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Doctor Name</label>
              <input
                type="text"
                name="doctor_name"
                value={form.doctor_name}
                onChange={handleChange}
                required
                className="text-black w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="text-black w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="text-black w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="text-black w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Speciality</label>
              <input
                type="text"
                name="speciality"
                value={form.speciality}
                onChange={handleChange}
                required
                className="text-black w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Slots</label>
            {form.slots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-4 mb-3">
                <input
                  type="time"
                  name="start_time"
                  value={slot.start_time}
                  onChange={(e) => handleSlotChange(idx, e)}
                  required
                  className="text-black w-32 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  name="end_time"
                  value={slot.end_time}
                  onChange={(e) => handleSlotChange(idx, e)}
                  required
                  className="text-black w-32 p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {form.slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(idx)}
                    className="ml-2 text-red-500 hover:text-red-700 text-xl font-bold focus:outline-none"
                    title="Remove slot"
                  >
                    &minus;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSlot}
              className="mt-2 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              <span className="text-xl mr-2">+</span> Add Slot
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold text-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
    {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg p-6 w-[90vw] max-w-4xl shadow-lg relative max-h-[80vh] overflow-auto"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold text-center mb-4">Appointments</h3>

            {loadingAppointments && <p>Loading appointments...</p>}

            {appointmentError && (
              <p className="text-red-500">Error: {appointmentError}</p>
            )}

            {!loadingAppointments && !appointmentError && appointments.length === 0 && (
              <p>No appointments found.</p>
            )}

            {!loadingAppointments && appointments.length > 0 && (
              <table className="w-full border-collapse border border-gray-300 text-black">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-3 py-2">Patient Name</th>
                    <th className="border border-gray-300 px-3 py-2">Age</th>
                    <th className="border border-gray-300 px-3 py-2">Gender</th>
                    <th className="border border-gray-300 px-3 py-2">Phone</th>
                    <th className="border border-gray-300 px-3 py-2">Date</th>
                    <th className="border border-gray-300 px-3 py-2">Slot Time</th>
                    <th className="border border-gray-300 px-3 py-2">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="even:bg-gray-100 text-black">
                      <td className="border border-gray-300 px-3 py-2">{appt.patient_name}</td>
                      <td className="border border-gray-300 px-3 py-2">{appt.age}</td>
                      <td className="border border-gray-300 px-3 py-2">{appt.gender}</td>
                      <td className="border border-gray-300 px-3 py-2">{appt.phone}</td>
                      <td className="border border-gray-300 px-3 py-2">{appt.date}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {appt.slot.start_time} to {appt.slot.end_time}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorPanel;
