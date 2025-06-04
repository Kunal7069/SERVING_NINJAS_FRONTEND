import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TiffinServices() {
  const [tiffinServices, setTiffinServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [educatorId,setEducatorId]= useState(null)
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    age: '',
    address: '',
    phone: ''
  });

  const handleChange1 = (e) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value
  }));
};

  const fetchSlots = async () => {
  console.log("FETCH SLOTS")
  if (!form.date) {
    alert("Please select a date first.");
    return;
  }

  try {
    console.log(educatorId,form.date)
    const response = await fetch("https://serving-ninjas.onrender.com/educator/free-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        educator_id: educatorId,
        date: form.date
      })
    });

    const data = await response.json();
    setSlots(data);
  } catch (error) {
    console.error("Error fetching slots:", error);
    alert("Failed to fetch slots.");
  }
};

  useEffect(() => {
    axios.get('https://serving-ninjas.onrender.com/educator')
      .then(response => setTiffinServices(response.data))
      .catch(error => console.error('Error fetching tiffin services:', error));
  }, []);

  const filteredServices = tiffinServices.filter(service =>
    service.center_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.educator_name.includes(searchTerm.toLowerCase()) ||
    service.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.phone.includes(searchTerm)
  );

  const openModal = (service) => {
    setEducatorId(service.id)
    setSelectedService(service);
    setShowModal(true);
    setForm({ name: '', gender: '', age: '', address: '', phone: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const fetchAppointments = async () => {
    setLoading(true);
    let name = "hii"
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      name = userData.name
      
    }
    console.log("NAME",name)
    try {
      const response = await fetch("https://serving-ninjas.onrender.com/educator-appointment/by-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_name: name }),
      });
      
      const data = await response.json();
      console.log(data)
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedSlotId) {
    alert("Please select a slot.");
    return;
  }

  const payload = {
    educator_id: educatorId,
    slot_id: selectedSlotId,
    student_name: form.name,
    gender: form.gender,
    date: form.date,
    age: parseInt(form.age),
    address: form.address,
    phone: form.phone,
  };

  console.log(payload)

  try {
    const res = await fetch("https://serving-ninjas.onrender.com/educator-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    let email = "hii"
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      email = userData.email
      
    }

    const emailRes = await fetch("https://serving-ninjas.onrender.com/appointment/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      receiver_email: email,
      body: `Your appointment has been booked successfully. Confirmation for: ${email}`
    }),
  });

  const emailResult = await emailRes.json();
  console.log("Email sent response:", emailResult);
  alert("Appointment booked successfully!");
  closeModal(); // Optionally reset form as well
  } catch (err) {
    console.error(err);
    alert("Failed to book appointment.");
  }
};
  useEffect(() => {
      if (isModalOpen) {
        fetchAppointments();
      }
    }, [isModalOpen]);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 pt-12">
       <div>
       <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
        >
          Appointments
        </button>
      </div>
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center relative w-[90%] max-w-4xl max-h-[80%] overflow-auto">
            <h2 className="text-black text-2xl font-bold mb-4">Appointments</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-black hover:text-gray-800 text-xl"
            >
              ×
            </button>

            {loading ? (
              <p className="text-gray-700">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-gray-700">No appointments found.</p>
            ) : (
              <table className="min-w-full text-left mt-4">
                <thead>
                  <tr className="bg-gray-200 text-sm text-gray-700">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Educator</th>
                    <th className="px-4 py-2">Center Name</th>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Meet</th>
                  </tr>
                </thead>
                <tbody>
                {appointments.map((appt, idx) => {
                  console.log("Appointment:", appt); // DEBUG LINE
                  return (
                    <tr key={appt.id || idx} className="border-b text-sm text-black">
                      <td className="px-4 py-2">{appt.date}</td>
                      <td className="px-4 py-2">{appt.educator?.educator_name || "N/A"}</td>
                      <td className="px-4 py-2">{appt.educator?.center_name || "N/A"}</td>
                      <td className="px-4 py-2">{appt.educator?.subject || "N/A"}</td>
                      <td className="px-4 py-2">
                        {appt.slot?.start_time || "N/A"} - {appt.slot?.end_time || "N/A"}
                      </td>
                      <td className="px-4 py-2">{appt.phone}</td>
                      <td className="px-4 py-2">
                        <a
                          href="https://meet.google.com/nrj-mkgv-bau"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Meet
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      </div>

      <h2 className="text-5xl font-bold text-center mb-12 text-amber-800 drop-shadow-lg">Educalm Services</h2>
      <input
        type="text"
        placeholder="Search by name, contact, address, or services"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mx-auto mb-8 p-3 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-md bg-white text-gray-800 placeholder-gray-500 transition duration-300 ease-in-out"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 border border-yellow-200">
              <h3 className="text-2xl font-semibold mb-3 text-blue-800">{service.center_name}</h3>
            <p className="text-blue-600 mb-2">Educator: {service.educator_name}</p>
            <p className="text-blue-600 mb-2">Address: {service.address}</p>
            <p className="text-blue-600 mb-2">Phone: {service.phone}</p>
            <p className="text-blue-600 mb-2">City: {service.city}</p>
            <p className="text-blue-600 mb-2">Speciality: {service.subject}</p>
            <button
              className="mt-2 w-full bg-gradient-to-r from-yellow-400 to-orange-300 text-yellow-900 font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
              onClick={() => openModal(service)}
            >
              Book Your Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out h-[100vh]">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 ease-in-out scale-95 animate-fade-in">
            <button
              className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-amber-600 transition duration-300 ease-in-out"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-amber-800">Book Your Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="text-black w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="text-black w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
                  placeholder="Male / Female / Other"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  min="0"
                  className="text-black w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
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
                  className="text-black w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="text-black w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
                  placeholder="Enter your phone number"
                />
              </div>
               
                <div>
          <label className="block text-gray-700 font-semibold mb-1">Appointment Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange1}
            required
            className="text-black w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
          />
        </div>

                <button
          type="button"
          onClick={fetchSlots}
          className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
        >
          Fetch Slots
        </button>

       
        {slots.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-blue-700">Available Slots:</h4>
            {slots.map((slot) => (
              // <div
              //   key={slot.id}
              //   className="p-2 bg-blue-100 rounded text-sm font-medium text-blue-800"
              // >
              //   {slot.start_time} - {slot.end_time}
              // </div>
              <label key={slot.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    checked={selectedSlotId === slot.id}
                    onChange={() => setSelectedSlotId(slot.id)}
                    required
                  />
                  <span className="text-gray-800">{slot.start_time} - {slot.end_time}</span>
                </label>
            ))}
          </div>
        )}


              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-amber-800 text-white py-4 w-full text-center mt-auto border-t border-yellow-300">
        <p className="text-sm">&copy; 2023 Service Website. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline hover:text-yellow-200 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-yellow-200 transition-colors">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-yellow-200 transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default TiffinServices;