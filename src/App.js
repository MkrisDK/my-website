import React from 'react';
import { Menu, X, ArrowRight, GitHub, Twitter, Linkedin } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold">YourName</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#home" className="px-3 py-2 text-gray-700 hover:text-black">Home</a>
              <a href="#about" className="px-3 py-2 text-gray-700 hover:text-black">About</a>
              <a href="#projects" className="px-3 py-2 text-gray-700 hover:text-black">Projects</a>
              <a href="#contact" className="px-3 py-2 text-gray-700 hover:text-black">Contact</a>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 text-gray-700">Home</a>
            <a href="#about" className="block px-3 py-2 text-gray-700">About</a>
            <a href="#projects" className="block px-3 py-2 text-gray-700">Projects</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="pt-20 pb-10 lg:pt-32 lg:pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">
          Welcome to My Website
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          I create amazing digital experiences
        </p>
        <div className="mt-10">
          <a href="#contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Get in Touch <ArrowRight className="ml-2" size={20} />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img 
            src="/api/placeholder/400/400"
            alt="Profile" 
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <p className="text-lg text-gray-600 mb-6">
            I'm a passionate developer/designer with experience in creating modern web applications.
            My focus is on building intuitive and engaging user experiences.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            With expertise in React, Node.js, and modern web technologies, I bring ideas to life
            through clean code and beautiful design.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-black">
              <GitHub size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-black">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Projects = () => (
  <section id="projects" className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-12">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((project) => (
          <div key={project} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={`/api/placeholder/400/300`}
              alt={`Project ${project}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Project Title {project}</h3>
              <p className="text-gray-600 mb-4">
                A brief description of this amazing project and its key features.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Learn More <ArrowRight className="inline ml-1" size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-gray-800 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">YourName</h3>
          <p className="text-gray-400">
            Creating amazing digital experiences
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
            <li><a href="#projects" className="text-gray-400 hover:text-white">Projects</a></li>
            <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Connect</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <GitHub size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} YourName. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
