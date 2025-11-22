import React, { useState } from 'react';
import { ChevronDown, Check, X, Star, BarChart3, Calculator, TrendingUp, Clock, Menu, ArrowRight, MessageCircle, Shield, FileText, Headphones, Mail, Phone, User } from 'lucide-react';
import { profileImages, handleImageError } from './assets/images';
import LoanApplicationModal from './components/LoanApplicationModal';
import AdminPortal from './components/AdminPortal';

// Smooth scroll helper function
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Contact Modal Component
const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email content
    const subject = `CredNest Loan Inquiry from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}

---
This inquiry was submitted through the CredNest website contact form.
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:contact@crednest.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    onClose();
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/917021904923', '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Contact Us</h2>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </button>
          
          <div className="text-center text-gray-500 text-sm">or</div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="How can we help you with your loan needs?"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-md font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// The main component which exports the entire replicated page.
const App = () => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Check if current URL is admin route
  React.useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setShowAdminPortal(true);
    }
  }, []);

  if (showAdminPortal) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onGetStarted={() => setIsLoanModalOpen(true)} />
      <main>
        <HeroSection onGetStarted={() => setIsLoanModalOpen(true)} />
        <PartnersSection />
        <ComparisonTable />
        <LoanTypesSection />
        <TestimonialsSection />
        <PersonalizedAdviceSection />
        <LoanCalculatorSection />
        {/* <OtherCalculators /> */}
        {/* <LoanTipsSection /> */}
        <FAQSection />
      </main>
      <Footer />
      <LoanApplicationModal 
        isOpen={isLoanModalOpen} 
        onClose={() => setIsLoanModalOpen(false)} 
      />
      
      {/* Admin Access Button - Hidden but accessible via URL */}
      <button
        onClick={() => setShowAdminPortal(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full opacity-20 hover:opacity-100 transition-opacity"
        title="Admin Access"
      >
        <Shield className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- Component 1: Header ---
const Header = ({ onGetStarted }: { onGetStarted?: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
            className="flex items-center cursor-pointer"
          >
            <span className="text-2xl font-bold text-gray-900">
              CrediNest
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 text-sm font-medium text-gray-700">
            <button 
              onClick={() => handleNavClick('comparison')}
              className="hover:text-emerald-600 transition-colors duration-200 relative group py-2"
            >
              Loans
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => handleNavClick('calculator')}
              className="hover:text-emerald-600 transition-colors duration-200 relative group py-2"
            >
              Calculators
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            {/* <button 
              onClick={() => handleNavClick('resources')}
              className="hover:text-emerald-600 transition-colors duration-200 relative group py-2"
            >
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </button> */}
            <button 
              onClick={() => handleNavClick('partners')}
              className="hover:text-emerald-600 transition-colors duration-200 relative group py-2"
            >
              Partners
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>

          {/* Desktop Contact Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-4 border-t border-gray-200 animate-fadeIn">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavClick('comparison')}
                className="text-left text-base font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                Loans
              </button>
              <button 
                onClick={() => handleNavClick('calculator')}
                className="text-left text-base font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                Calculators
              </button>
              <button 
                onClick={() => handleNavClick('resources')}
                className="text-left text-base font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                Resources
              </button>
              <button 
                onClick={() => handleNavClick('partners')}
                className="text-left text-base font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
              >
                Partners
              </button>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md"
                >
                  Contact Us
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </header>
  );
};

// --- Component 2: Hero Section ---
interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => (
  <div className="bg-gray-900 text-white p-6 rounded-2xl space-y-2 border border-gray-800 w-full hover:shadow-xl transition-all duration-300">
    <div className="text-4xl font-extrabold text-emerald-400">{value}</div>
    <div className="text-sm text-gray-300 font-medium">{label}</div>
    {icon && (
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        <div className="text-xs text-gray-400">View details</div>
        <div className="text-emerald-400">{icon}</div>
      </div>
    )}
  </div>
);

const HeroSection = ({ onGetStarted }: { onGetStarted?: () => void }) => (
  <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:pt-32 lg:pb-20 flex flex-col lg:flex-row items-center justify-between">
    <div className="lg:w-5/12 text-center lg:text-left mb-12 lg:mb-0">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight font-display">
        Best Loan Rates,
        <br />
        <span className="text-emerald-600">CrediNest</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
        Get instant home loans, personal loans & balance transfers at lowest interest rates from 7.35% PA. Quick approval in 15-20 days with CrediNest - India's trusted loan partner.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={onGetStarted || (() => scrollToSection('calculator'))}
          className="flex-1 sm:flex-none text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
        <a 
          href="https://wa.me/917021904923"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 py-4 px-10 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </div>

    <div className="lg:w-6/12 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <StatCard
        value="₹300 Cr+"
        label="Disbursed Amount"
        icon={<TrendingUp className="w-6 h-6" />}
      />
      <StatCard
        value="6000+"
        label="Happy Customers"
        icon={<Star className="w-6 h-6" />}
      />
      <StatCard
        value="60+"
        label="Banking Partners"
        icon={<Shield className="w-6 h-6" />}
      />
      <StatCard
        value="4.9/5"
        label="Google Rating"
        icon={<Star className="w-6 h-6" />}
      />
    </div>
  </section>
);

// --- Component 3: Partners Section ---
const PartnersSection = () => {
  const bankLogos = [
    '/static/bank1.31609d6e.png',
    '/static/bank2.41607330.png',
    '/static/bank3.94fe7691.png',
    '/static/bank4.66aad27d.png',
    '/static/bank5.00c5700a.png',
    '/static/bank6.ac2df3b6.png',
  ];

  return (
    <section id="partners" className="bg-gray-50 py-16 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-gray-500 mb-8 uppercase tracking-wider">
          A partnership with the <span className="text-gray-900 font-bold">largest banks</span>
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {bankLogos.map((logo, index) => (
            <div key={index} className="group">
              <div className="px-6 py-3 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg h-16 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt={`Bank ${index + 1}`}
                  className="h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Component 4: Comparison Table ---
interface TableRowProps {
  param: string;
  jugyahValue: string;
  traditionalValue: string;
  jugyahIcon: 'check' | 'x';
  traditionalIcon: 'check' | 'x';
}

const TableRow: React.FC<TableRowProps> = ({ param, jugyahValue, traditionalValue, jugyahIcon, traditionalIcon }) => {
  const Icon = ({ isCheck }: { isCheck: boolean }) =>
    isCheck ? (
      <Check className="w-5 h-5 text-emerald-500" />
    ) : (
      <X className="w-5 h-5 text-red-500" />
    );

  return (
    <div className="grid grid-cols-3 gap-4 border-b border-gray-700 py-5 items-center hover:bg-gray-800/30 transition-colors duration-200 rounded-lg px-2 -mx-2">
      <div className="text-sm text-gray-300 font-semibold">{param}</div>
      <div className="text-sm text-white flex items-center space-x-2">
        {jugyahIcon && <Icon isCheck={jugyahIcon === 'check'} />}
        <span className="font-medium">{jugyahValue}</span>
      </div>
      <div className="text-sm text-white flex items-center space-x-2">
        {traditionalIcon && <Icon isCheck={traditionalIcon === 'check'} />}
        <span className="font-medium">{traditionalValue}</span>
      </div>
    </div>
  );
};

const ComparisonTable = () => (
  <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">Why Choose CredNest? Compare Our Advantages</h2>
        <p className="text-gray-600">See how CredNest outperforms traditional loan processes</p>
    </div>
    <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 pb-6 border-b border-gray-700">
        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Features</div>
        <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          CredNest
        </div>
        <div className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          Traditional Loans
        </div>
      </div>

      {/* Table Rows */}
      <TableRow
        param="Interest Rates"
        jugyahValue="From 7.35% PA"
        traditionalValue="High Interest Rates"
        jugyahIcon="check"
        traditionalIcon="x"
      />
      <TableRow
        param="Approval Time"
        jugyahValue="15-20 Days"
        traditionalValue="1-6 Months"
        jugyahIcon="check"
        traditionalIcon="x"
      />
      <TableRow
        param="Loan Application Process"
        jugyahValue="Simple, Fully Digital Process"
        traditionalValue="Paperwork and Multiple Bank Visits"
        jugyahIcon="check"
        traditionalIcon="x"
      />
      <TableRow
        param="Digital tools and Resources"
        jugyahValue="Real-time Loan Progress Tracker"
        traditionalValue="No Tracker and Digital Tools"
        jugyahIcon="check"
        traditionalIcon="x"
      />
      <TableRow
        param="Disbursed Percentage"
        jugyahValue="Upto 100%"
        traditionalValue="About 70% - 85%"
        jugyahIcon="check"
        traditionalIcon="x"
      />
      <TableRow
        param="Customer Support"
        jugyahValue="Support throughout the Journey"
        traditionalValue="Limited inconsistent support"
        jugyahIcon="check"
        traditionalIcon="x"
      />
    </div>
  </section>
);

// --- Component 5: Loan Types Section ---
interface LoanTypeCardProps {
  icon: string;
  title: string;
  description: string;
}

const LoanTypeCard: React.FC<LoanTypeCardProps> = ({ icon, title, description }) => (
  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <img src={icon} alt={title} className="w-12 h-12" onError={(e) => {
          e.currentTarget.style.display = 'none';
        }} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

const LoanTypesSection = () => {
  const loanTypes = [
    {
      icon: '/static/homeLoans.e211848b.svg',
      title: 'Home Loans at Lowest Rates',
      description: 'Get home loans from 7.35% PA with quick approval in 15-20 days. Compare 60+ banks instantly'
    },
    {
      icon: '/static/balanceTransfer.5fb1b642.svg',
      title: 'Balance Transfer & Save Interest',
      description: 'Transfer your existing home loan and save up to ₹5 lakhs on interest payments with CrediNest'
    },
    {
      icon: '/static/loanAgainstProperty.996f26f0.svg',
      title: 'Loan Against Property',
      description: 'Get instant loan against property at competitive rates. Unlock your property value with CrediNest'
    }
  ];

  return (
    <section className="relative my-20 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('/static/UspImage3.a7182985.webp')`,
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">Get Best Loan Rates with CrediNest</h2>
        <p className="text-gray-600">Choose from home loans, personal loans, or balance transfer. Get pre-approved in minutes with lowest interest rates in India</p>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loanTypes.map((loan, index) => (
            <LoanTypeCard key={index} {...loan} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Component 6: Testimonials Section ---
interface TestimonialCardProps {
  name: string;
  role: string;
  review: string;
  rating: number;
  image?: string;
  isMain?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, review, rating, image, isMain = false }) => {
  if (isMain) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-3xl border border-gray-700 shadow-2xl flex flex-col md:flex-row gap-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="flex items-center space-x-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-emerald-500/20">
                {image ? (
                  <img src={image} alt={name} className="w-full h-full rounded-full object-cover" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }} />
                ) : (
                  name.charAt(0)
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
            <div>
              <div className="font-bold text-xl text-white">{name}</div>
              <div className="text-sm text-emerald-300 font-semibold bg-emerald-900/30 px-3 py-1 rounded-full inline-block mt-1">{role}</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-6xl text-emerald-400/20 font-serif leading-none">"</div>
            <p className="text-gray-100 leading-relaxed text-lg -mt-4 pl-8">
              {review}
            </p>
            <div className="text-6xl text-emerald-400/20 font-serif leading-none text-right -mt-2">"</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
              ))}
              <span className="ml-3 text-sm text-gray-300 font-medium">Verified Customer</span>
            </div>
          </div>
        </div>
        
        {image && (
          <div className="flex-shrink-0 relative z-10">
            <div className="relative">
              <img 
                src={image} 
                alt={name}
                className="w-40 h-40 rounded-2xl object-cover border-4 border-emerald-500/30 shadow-2xl"
                onError={handleImageError}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-lg flex flex-col justify-between h-full hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1 group">
      <div>
        <div className="flex items-start space-x-4 mb-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center text-emerald-700 text-lg font-bold shadow-md group-hover:shadow-lg transition-shadow">
              {image ? (
                <img src={image} alt={name} className="w-full h-full rounded-full object-cover" onError={handleImageError} />
              ) : (
                name.charAt(0)
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">{name}</div>
            <div className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">{role}</div>
          </div>
        </div>
        <div className="mb-5">
          <div className="text-3xl text-emerald-200 font-serif leading-none">"</div>
          <p className="text-sm text-gray-700 leading-relaxed -mt-2 pl-4">
            {review}
          </p>
          <div className="text-3xl text-emerald-200 font-serif leading-none text-right -mt-1">"</div>
        </div>
      </div>
      <div className="pt-5 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
          ))}
        </div>
        <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-full">Verified Review</span>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const reviews = [
    { 
      name: 'Shubham Shine', 
      role: 'Software Engineer & Homeowner', 
      review: "CredNest transformed my home buying journey completely! As a first-time buyer, I was overwhelmed by the loan process, but their team guided me through every step. They secured me an interest rate that was 0.5% lower than what other banks offered. The digital documentation process saved me countless trips to the bank. What impressed me most was their transparency - no hidden charges, clear communication, and they delivered exactly what they promised. My loan was approved in just 12 days!", 
      rating: 5,
      image: profileImages.shubhamShine,
      isMain: true
    },
    { 
      name: 'Neha Aggarwal', 
      role: 'Marketing Manager', 
      review: "Outstanding service from CredNest! They helped me with a balance transfer that saved me ₹3 lakhs in interest over the loan tenure. The team was professional, responsive, and made the entire process seamless. Highly recommend their expertise!", 
      rating: 5,
      image: profileImages.nehaAggarwal
    },
    { 
      name: 'Krishna Salunke', 
      role: 'Business Owner', 
      review: "I needed a loan against property for business expansion. CredNest not only got me the best rates but also ensured quick processing. Their relationship manager was available 24/7 to answer my queries. Excellent service and genuine care for customers.", 
      rating: 5,
      image: profileImages.krishnaSalunke
    },
    { 
      name: 'Vishal Gupta', 
      role: 'Financial Consultant', 
      review: "As someone in the finance industry, I appreciate CredNest's professional approach and competitive rates. They provided multiple loan options and helped me choose the best one for my investment property. The entire process was transparent and efficient.", 
      rating: 5,
      image: profileImages.vishalGupta
    },
  ];

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Star className="w-4 h-4 fill-emerald-700" />
          Customer Stories
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 font-display">
          Hear what our clients have to say about us
          <span className="text-red-500 ml-2">❤️</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join thousands of satisfied customers who trusted CredNest for their loan journey
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">4.9/5 Rating</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-sm font-semibold text-gray-700">6000+ Happy Customers</div>
        </div>
      </div>
      
      <div className="mb-12">
        {reviews.filter(r => r.isMain).map((review, index) => (
          <TestimonialCard key={index} {...review} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.filter(r => !r.isMain).map((review, index) => (
          <TestimonialCard key={index} {...review} />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-2xl border border-emerald-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to join our satisfied customers?</h3>
          <p className="text-gray-600 mb-6">Experience the CredNest difference - transparent, fast, and customer-focused loan services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('calculator')}
              className="text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Calculate Your EMI
            </button>
            <a 
              href="https://wa.me/917021904923"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-emerald-700 bg-white border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Get Expert Advice
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Component 7: Personalized Advice Section ---
const PersonalizedAdviceSection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Card */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">Personalized Advice from CredNest</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Get expert guidance and 24/7 support tailored to your unique needs with CredNest's dedicated team.
        </p>
        <img 
          src="/static/UspImage1.e49abf01.webp" 
          alt="Customer Support"
          className="w-full h-64 object-cover rounded-xl"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x400/e5e7eb/9ca3af?text=Support';
          }}
        />
      </div>

      {/* Right Card */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">Talk to a CredNest expert now!</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Our CredNest loan agents can handle everything for you.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Best Offers</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Maximum Funding</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Documentation</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Support</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 py-3 px-6 rounded-xl transition-all duration-300 shadow-md">
            Get in Touch
          </button>
          <a 
            href="https://wa.me/917021904923"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-3 px-6 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
);

// --- Component 8: Loan Calculator Section ---
interface CalculatorSliderProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const CalculatorSlider: React.FC<CalculatorSliderProps> = ({ label, value, unit, min, max, step, onChange }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="text-xl font-bold text-emerald-600">
        {unit === '₹' ? `₹${(value / 100000).toFixed(1)}L` : `${value}${unit}`}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
      style={{
        background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${((value - min) / (max - min)) * 100}%, rgb(229, 231, 235) ${((value - min) / (max - min)) * 100}%, rgb(229, 231, 235) 100%)`
      }}
    />
  </div>
);

const LoanCalculatorSection = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenure, setTenure] = useState(1);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 100 / 12;
    const time = tenure * 12;

    if (rate === 0) return principal / time;
    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    return isNaN(emi) || emi === Infinity ? 0 : emi;
  };

  const monthlyEMI = calculateEMI();
  const totalInterest = monthlyEMI * tenure * 12 - loanAmount;
  const totalPayment = loanAmount + totalInterest;

  return (
    <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">CredNest EMI Calculator</h2>
        <p className="text-gray-600">Calculate your monthly EMI instantly with CredNest</p>
      </div>
      <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Input Controls */}
        <div>
          <CalculatorSlider
            label="Loan Amount"
            value={loanAmount}
            unit="₹"
            min={100000}
            max={10000000}
            step={100000}
            onChange={setLoanAmount}
          />
          <CalculatorSlider
            label="Rate of interest (p.a.)"
            value={interestRate}
            unit="%"
            min={1}
            max={25}
            step={0.1}
            onChange={setInterestRate}
          />
          <CalculatorSlider
            label="Loan Tenure"
            value={tenure}
            unit=" Years"
            min={1}
            max={30}
            step={1}
            onChange={setTenure}
          />
        </div>

        {/* Right: Results Display */}
        <div className="space-y-5">
          <div className="bg-emerald-50 p-6 rounded-xl shadow-lg border-l-4 border-emerald-500">
            <div className="text-sm text-gray-600 font-medium mb-2">Your Monthly EMI</div>
            <div className="text-4xl font-extrabold text-emerald-600">
              ₹ {parseFloat(monthlyEMI.toFixed(0)).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">per month</div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md grid grid-cols-2 gap-5 text-sm border border-gray-200">
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="text-gray-600 font-medium mb-1">Principal amount</div>
              <div className="font-bold text-gray-900 text-lg">₹ {loanAmount.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="text-gray-600 font-medium mb-1">Interest at {interestRate}%</div>
              <div className="font-bold text-gray-900 text-lg">₹ {parseFloat(totalInterest.toFixed(0)).toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-5 rounded-xl">
            <div className="text-sm text-gray-300 font-medium mb-2">Total Payment (Principal + Interest)</div>
            <div className="text-2xl font-bold">₹ {parseFloat(totalPayment.toFixed(0)).toLocaleString()}</div>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-xl">
            <p className="text-sm mb-4">Know your options. Unlock your home loan journey with CredNest.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => scrollToSection('comparison')}
                className="flex-1 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl transition-all duration-300 shadow-md"
              >
                Find Now
              </button>
              <a 
                href="https://wa.me/917021904923"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-base font-semibold text-white bg-gray-800 hover:bg-gray-700 py-3 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Component 9: Other Calculators ---
interface CalcCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const CalcCard: React.FC<CalcCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer h-full group">
    <div className="p-4 bg-emerald-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
      <Icon className="w-8 h-8 text-emerald-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
    <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
      Calculate
    </button>
  </div>
);

const OtherCalculators = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">Try CredNest's Other Calculators</h2>
      <p className="text-gray-600">Powerful tools to help you make informed financial decisions</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <CalcCard
        icon={FileText}
        title="Stamp Duty Calculator"
        description="Calculate stamp duty charges for your property purchase."
      />
      <CalcCard
        icon={Calculator}
        title="Loan Pre-payment Calculator"
        description="See how much you can save by prepaying your loan."
      />
      <CalcCard
        icon={BarChart3}
        title="Rental Yield Calculator"
        description="Calculate the rental yield on your investment property."
      />
    </div>
  </section>
);

// --- Component 10: Loan Tips & Guide Section ---
interface TipCardProps {
  title: string;
  author: string;
  readTime: string;
  image: string;
}

const TipCard: React.FC<TipCardProps> = ({ title, author, readTime, image }) => (
  <a href="#" className="block group">
    <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x200/9ca3af/ffffff?text=Guide';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 bg-white">
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-2 transition-colors mb-2">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">{author}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            {readTime}
          </span>
        </div>
      </div>
    </div>
  </a>
);

const LoanTipsSection = () => {
  const tips = [
    {
      title: "Home Loan Benefits for Women: Everything You Need to Know",
      author: "Devashrita Gupta",
      readTime: "15 mins read",
      image: "/static/UspImage2.12a338ef.webp"
    },
    {
      title: "How to Improve Your CIBIL Score for Better Loan Rates",
      author: "Financial Expert",
      readTime: "10 mins read",
      image: "/static/ourOfferings.d8a4effd.webp"
    },
    {
      title: "The Ultimate Checklist Before Applying for a Home Loan",
      author: "Loan Advisor",
      readTime: "8 mins read",
      image: "/static/UspImage1.e49abf01.webp"
    },
    {
      title: "Understanding the Different Types of Business Loans",
      author: "Business Finance",
      readTime: "12 mins read",
      image: "/static/UspImage3.a7182985.webp"
    }
  ];

  return (
    <section id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">CredNest Loan Tips And Guide</h2>
        <p className="text-gray-600">Your CredNest Guide to Property & Loans Trends</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {tips.map((tip, index) => (
          <TipCard key={index} {...tip} />
        ))}
      </div>
    </section>
  );
};

// --- Component 11: FAQ Section ---
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-5 group">
      <button
        className="flex justify-between items-center w-full text-left hover:bg-gray-50/50 -mx-4 px-4 py-2 rounded-lg transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors pr-4">{question}</span>
        <div className="flex-shrink-0">
          {isOpen ? (
            <X className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-all" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 transition-all" />
          )}
        </div>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-600 leading-relaxed pl-0 animate-fadeIn">{answer}</p>
      )}
    </div>
  );
};

const FAQSection = () => (
  <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-display">Home Loan & Personal Loan FAQs</h2>
      <p className="text-gray-600">Everything you need to know about CrediNest loan services, interest rates, and approval process</p>
    </div>
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
        <FAQItem
          question="What are the lowest home loan interest rates available in India?"
          answer="CrediNest offers home loans starting from 7.35% PA, which are among the lowest rates in India. Interest rates vary based on your CIBIL score, income, loan amount, and tenure. With a good credit score (750+), you can get the best rates from our 60+ partner banks."
        />
        <FAQItem
          question="How quickly can I get loan approval with CrediNest?"
          answer="CrediNest provides quick loan approval in just 15-20 days. Our streamlined process includes instant pre-approval, digital documentation, and dedicated relationship managers to ensure faster processing compared to traditional banks."
        />
        <FAQItem
          question="What types of loans does CrediNest offer?"
          answer="CrediNest specializes in home loans, personal loans, loan against property, and balance transfers. We offer competitive rates starting from 7.35% PA with flexible tenure options from 5-30 years depending on the loan type."
        />
        <FAQItem
          question="How does balance transfer save money on existing loans?"
          answer="Balance transfer with CrediNest can save you up to ₹5 lakhs on interest payments. By transferring your existing loan to a lower interest rate, you reduce your EMI burden and total interest outgo. Our experts help you compare rates and choose the best option."
        />
        <FAQItem
          question="What documents are required for CrediNest loan application?"
          answer="For loan application, you need: Aadhaar card, PAN card, salary slips (3 months), bank statements (6 months), Form 16, employment certificate, and property documents (for home loans). Our digital process makes document submission quick and easy."
        />
        <FAQItem
          question="How does CIBIL score affect loan interest rates?"
          answer="Your CIBIL score significantly impacts loan interest rates. A score of 750+ qualifies for the lowest rates starting from 7.35% PA. Lower scores may result in higher rates or rejection. CrediNest helps improve your loan eligibility with expert guidance."
        />
        <FAQItem
          question="What is the maximum loan amount I can get from CrediNest?"
          answer="The maximum loan amount depends on your income, CIBIL score, and property value. CrediNest offers home loans up to ₹10 crores, personal loans up to ₹50 lakhs, and loan against property up to 70% of property value. Use our EMI calculator to check eligibility."
        />
      </div>
    </div>
  </section>
);

// --- Component 12: Footer ---
interface FooterLinkGroupProps {
  title: string;
  links: string[];
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => (
  <div className="space-y-4">
    <h4 className="text-base font-bold text-white">{title}</h4>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 mt-20 pt-16 pb-8 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        {/* Logo/Contact Column */}
        <div className="col-span-2 lg:col-span-1 space-y-5">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">
              CredNest
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:contact@crednest.io" className="hover:text-emerald-400 transition-colors text-sm">
                contact@crednest.io
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <a href="tel:+917021904923" className="hover:text-emerald-400 transition-colors text-sm">
                +91 70219 04923
              </a>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-1.485 1.51-3.054 3.111-3.054 3.329 0 3.945 2.19 3.945 5.054v6.791zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
            </a>
          </div>
        </div>

        {/* Link Groups */}
        <FooterLinkGroup
          title="Loan Services"
          links={['Home Loans', 'Personal Loans', 'Balance Transfer', 'Loan Against Property', 'EMI Calculator']}
        />
        <FooterLinkGroup
          title="Company"
          links={['About CrediNest', 'Contact Us', 'Careers', 'Partner Banks']}
        />
        <FooterLinkGroup
          title="Resources"
          links={['Loan Calculator', 'Interest Rates', 'Eligibility Check', 'Loan Guide', 'CIBIL Score']}
        />
        <FooterLinkGroup
          title="Support"
          links={['Help Centre', 'Terms of use', 'Privacy Policy', 'Loan FAQs']}
        />

        {/* Powered By Section */}
        <div className="col-span-2 lg:col-span-1">
          <h4 className="text-base font-bold text-white mb-4">Powered by</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <img src="/static/awslogo.39cdd602.svg" alt="AWS" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <img src="/static/digit-logo.a9a338e6.png" alt="Digit" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <img src="/static/bureau-logo.66d3355d.png" alt="Bureau" className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-gray-800 text-center">
        <p className="text-sm text-gray-400">
          Copyright © 2024 CrediNest. All rights reserved. | Best Home Loans & Personal Loans in India
        </p>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CN
            </div>
            <div>
              <p className="text-white font-semibold">Get Best Loan Rates with CrediNest</p>
              <p className="text-sm text-gray-400 mt-1">
                CrediNest is India's leading loan platform offering home loans, personal loans & balance transfers at lowest interest rates from 7.35% PA. Quick approval in 15-20 days with 60+ partner banks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default App;
