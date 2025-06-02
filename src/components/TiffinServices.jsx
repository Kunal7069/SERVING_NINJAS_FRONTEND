import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TiffinServices() {
  const [tiffinServices, setTiffinServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    age: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/tiffin')
      .then(response => setTiffinServices(response.data))
      .catch(error => console.error('Error fetching tiffin services:', error));
  }, []);

  const filteredServices = tiffinServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.contact.includes(searchTerm) ||
    service.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.services.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (service) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send this data to your backend here
    console.log('Meal Booking Data:', { ...form, tiffinService: selectedService });
    closeModal();
    alert('Meal booking request submitted!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 pt-12">
      <h2 className="text-5xl font-bold text-center mb-12 text-amber-800 drop-shadow-lg">Tiffin Services</h2>
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
            <h3 className="text-2xl font-semibold mb-3 text-amber-800">{service.name}</h3>
            <p className="text-amber-700 mb-2">Contact: {service.contact}</p>
            <p className="text-amber-700 mb-2">Address: {service.address}</p>
            <p className="text-amber-700 mb-4">Services: {service.services}</p>
            <button
              className="mt-2 w-full bg-gradient-to-r from-yellow-400 to-orange-300 text-yellow-900 font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 ease-in-out"
              onClick={() => openModal(service)}
            >
              Book Your Meal
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
            <h3 className="text-2xl font-bold mb-4 text-amber-800">Book Your Meal</h3>
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