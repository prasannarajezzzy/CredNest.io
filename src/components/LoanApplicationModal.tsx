import React, { useState } from 'react';
import { ChevronLeft, Home, Building2, Briefcase, DollarSign, Check } from 'lucide-react';
import { saveLoanApplication, LoanApplicationData } from '../api/loanApplication';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<LoanApplicationData>({
    loanType: '',
    propertyFinalized: null as any,
    propertyValue: '',
    profession: '',
    annualIncome: '',
    loanAmount: '',
    phoneNumber: ''
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const autoAdvance = () => {
    setTimeout(() => {
      if (currentStep < totalSteps && isStepValid()) {
        setCurrentStep(currentStep + 1);
      }
    }, 500); // Small delay for better UX
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveLoanApplication(formData);
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    setFormData({
      loanType: '',
      propertyFinalized: null as any,
      propertyValue: '',
      profession: '',
      annualIncome: '',
      loanAmount: '',
      phoneNumber: ''
    });
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.loanType !== '';
      case 2:
        return formData.propertyValue !== '';
      case 3:
        return formData.profession !== '' && formData.annualIncome !== '';
      case 4:
        return formData.loanAmount !== '';
      case 5:
        return formData.phoneNumber !== '' && formData.phoneNumber.length >= 10;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your loan application. Our team will review your details and contact you within 24 hours.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            )}
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-gray-500">
                {currentStep} of {totalSteps}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Step 1: Loan Type */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us what you are looking for</h2>
              <p className="text-gray-600 mb-8">Select the type of loan you need</p>
              
              <div className="space-y-4">
                {[
                  { id: 'new-home', title: 'New Home Loan', description: 'A home loan lets you buy a home and pay for it over time.', icon: Home },
                  { id: 'balance-transfer', title: 'Loan Balance Transfer', description: 'Replace your existing loan with a new one with better terms.', icon: Building2 },
                  { id: 'loan-against-property', title: 'Loan Against Property', description: 'Get a loan by using your property as collateral.', icon: Building2 }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setFormData({ ...formData, loanType: option.id });
                        autoAdvance();
                      }}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                        formData.loanType === option.id 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          formData.loanType === option.id ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            formData.loanType === option.id ? 'text-emerald-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Property Finalization and Value */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Have you finalised your property</h2>
              <p className="text-gray-600 mb-8">Tell us about your property status and value</p>
              
              <div className="space-y-6">
                {/* Property Finalization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Property Status</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: true, label: 'Yes, finalised' },
                      { id: false, label: "No I'm still looking" }
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          const newFormData = { ...formData, propertyFinalized: option.id };
                          setFormData(newFormData);
                          // Auto-advance if property value is also selected
                          if (newFormData.propertyValue !== '') {
                            autoAdvance();
                          }
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          formData.propertyFinalized === option.id 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Property Value</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Under 1 Crore',
                      '1 Crore to 2 Crore',
                      '2 Crore to 3 Crore',
                      'Above 3 Crore'
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          const newFormData = { ...formData, propertyValue: option };
                          setFormData(newFormData);
                          // Auto-advance if property status is also selected
                          if (formData.propertyFinalized !== null && formData.propertyFinalized !== undefined) {
                            autoAdvance();
                          }
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          formData.propertyValue === option 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Profession and Income */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your profession</h2>
              <p className="text-gray-600 mb-8">Tell us about your employment and income</p>
              
              <div className="space-y-6">
                {/* Profession */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Employment Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Salaried',
                      'Self Employed'
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          const newFormData = { ...formData, profession: option };
                          setFormData(newFormData);
                          // Auto-advance if annual income is also selected
                          if (newFormData.annualIncome !== '') {
                            autoAdvance();
                          }
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          formData.profession === option 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Briefcase className="w-6 h-6 mx-auto mb-2" />
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Your annual income</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Above 50 L',
                      '25L - 50L',
                      '18L - 25L',
                      '12L - 18L',
                      '6L - 12L',
                      'Below 6L'
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          const newFormData = { ...formData, annualIncome: option };
                          setFormData(newFormData);
                          // Auto-advance if profession is also selected
                          if (newFormData.profession !== '') {
                            autoAdvance();
                          }
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          formData.annualIncome === option 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Loan Amount */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Amount</h2>
              <p className="text-gray-600 mb-8">Enter the loan amount you need</p>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-gray-700 font-medium">₹</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Amount"
                  value={formData.loanAmount}
                  onChange={(e) => {
                    // Allow only numbers and commas
                    const value = e.target.value.replace(/[^\d,]/g, '');
                    setFormData({ ...formData, loanAmount: value });
                  }}
                  onBlur={() => {
                    // Auto-advance when user finishes typing (loses focus)
                    if (formData.loanAmount !== '') {
                      autoAdvance();
                    }
                  }}
                  className="w-full pl-16 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['10,00,000', '25,00,000', '50,00,000', '75,00,000', '1,00,00,000', '2,00,00,000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setFormData({ ...formData, loanAmount: amount });
                      autoAdvance();
                    }}
                    className="p-3 text-sm border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Phone Number */}
          {currentStep === 5 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CredNest</h2>
                <p className="text-gray-600">Don't worry we won't spam you, promise</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Enter Phone Number</label>
                <div className="flex">
                  <div className="flex items-center px-4 py-4 bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-xl">
                    <span className="text-sm font-medium text-gray-700">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phoneNumber: value });
                    }}
                    className="flex-1 px-4 py-4 text-lg border-2 border-gray-200 rounded-r-xl focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                {formData.phoneNumber && formData.phoneNumber.length < 10 && (
                  <p className="text-sm text-red-500 mt-2">Please enter a valid 10-digit phone number</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isStepValid()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center ${
                isStepValid() && !isSubmitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationModal;
