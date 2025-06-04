import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorServices() {
  const [doctorServices, setDoctorServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [doctorId,setDoctorId]= useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    let name = "hii"
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      name = userData.name
      
    }
    console.log("NAME",name,typeof(name))
    try {
      const response = await fetch("https://serving-ninjas.onrender.com/appointment/by-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient_name: name }),
      });
      
      const data = await response.json();
      console.log(data)
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchAppointments();
    }
  }, [isModalOpen]);

  const [form, setForm] = useState({
  name: '',
  gender: '',
  age: '',
  address: '',
  phone: '',
  date: ''
});

const [slots, setSlots] = useState([]);

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
    const response = await fetch("https://serving-ninjas.onrender.com/doctor/free-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        doctor_id: doctorId,
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
    axios.get('https://serving-ninjas.onrender.com/doctor/')
      .then(response => setDoctorServices(response.data))
      .catch(error => console.error('Error fetching doctor services:', error));
  }, []);

  const filteredServices = doctorServices.filter(service =>
    service.center_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.phone.includes(searchTerm) ||
    service.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (doctor) => {
    console.log(doctor.id);
    setDoctorId(doctor.id);
    setSelectedDoctor(doctor);
    setShowModal(true);
    setForm({ name: '', gender: '', age: '', address: '', phone: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedSlotId) {
    alert("Please select a slot.");
    return;
  }

  const payload = {
    doctor_id: doctorId,
    slot_id: selectedSlotId,
    patient_name: form.name,
    gender: form.gender,
    date: form.date,
    age: parseInt(form.age),
    address: form.address,
    phone: form.phone,
  };

  console.log(payload)

  try {
    const res = await fetch("https://serving-ninjas.onrender.com/appointment", {
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

  return (

    
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-50 pt-12">
        <div>
      {/* Top right button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
        >
          Appointments
        </button>
      </div>

      {/* Modal */}
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
                    <th className="px-4 py-2">Doctor</th>
                    <th className="px-4 py-2">Speciality</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Phone</th>
                  </tr>
                </thead>
                <tbody>
                {appointments.map((appt, idx) => {
                  console.log("Appointment:", appt); // DEBUG LINE
                  return (
                    <tr key={appt.id || idx} className="border-b text-sm text-black">
                      <td className="px-4 py-2">{appt.date}</td>
                      <td className="px-4 py-2">{appt.doctor?.doctor_name || "N/A"}</td>
                      <td className="px-4 py-2">{appt.doctor?.speciality || "N/A"}</td>
                      <td className="px-4 py-2">
                        {appt.slot?.start_time || "N/A"} - {appt.slot?.end_time || "N/A"}
                      </td>
                      <td className="px-4 py-2">{appt.phone}</td>
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
     


      <h2 className="text-5xl font-bold text-center mb-12 text-blue-800 drop-shadow-lg">Doctor Services</h2>
      <input
        type="text"
        placeholder="Search by name, doctor, address, phone, or city"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mx-auto mb-8 p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md bg-white text-gray-800 placeholder-gray-500 transition duration-300 ease-in-out"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 border border-blue-200"
          >
            <h3 className="text-2xl font-semibold mb-3 text-blue-800">{service.center_name}</h3>
            <p className="text-blue-600 mb-2">Doctors: {service.doctor_name}</p>
            <p className="text-blue-600 mb-2">Address: {service.address}</p>
            <p className="text-blue-600 mb-2">Phone: {service.phone}</p>
            <p className="text-blue-600 mb-2">City: {service.city}</p>
            <p className="text-blue-600 mb-2">Speciality: {service.speciality}</p>
            <button
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
              onClick={() => openModal(service)}
            >
              Book Your Appointment
            </button>
          </div>
        ))}
      </div>

     

      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out h-[100vh]">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 ease-in-out scale-95">
      <button
        className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-blue-600 transition duration-300 ease-in-out"
        onClick={closeModal}
        aria-label="Close"
      >
        &times;
      </button>
      <h3 className="text-2xl font-bold mb-4 text-blue-800">Book Appointment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
      
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="text-black w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
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
            className="text-black w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            placeholder="male / female / other"
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
            className="text-black w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
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
            className="text-black w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
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
            className="text-black w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
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
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
)}

      <footer className="bg-blue-900 text-white py-4 w-full text-center border-t border-blue-200">
        <p className="text-sm">&copy; 2023 Service Website. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline hover:text-cyan-200 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-cyan-200 transition-colors">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-cyan-200 transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default DoctorServices;