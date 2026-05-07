'use client'

import { motion } from 'framer-motion'
import PageHeader from '@/components/PageHeader'
import { useSiteSettings } from '@/lib/useSiteSettings'

export default function TermsAndConditions() {
  const settings = useSiteSettings()
  return (
    <div className="min-h-screen bg-white">
      <PageHeader 
        title="Terms & Conditions" 
        subtitle="Please read these terms carefully before using our services"
        backgroundImage={settings.about_hero_image_url || undefined}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="bg-white rounded-2xl shadow-elegant p-6 sm:p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to Miss Culture Global Kenya. By accessing our website and using our services, 
              including ticket purchases and voting, you agree to be bound by the following terms 
              and conditions.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Ticket Purchases</h2>
            <p className="text-gray-600 mb-4">
              All ticket sales are final. Tickets are non-refundable unless an event is cancelled by 
              the organizers. Each ticket is unique and valid for one entry only. Unauthorized 
              duplication or resale of tickets is strictly prohibited.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Voting System</h2>
            <p className="text-gray-600 mb-4">
              Voting is conducted through a secure payment-backed system. Each vote requires a 
              successful M-Pesa transaction. Votes are non-refundable and cannot be transferred 
              between contestants. Any attempt to manipulate the voting system through fraudulent 
              means will result in the disqualification of the associated votes.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Event Conduct</h2>
            <p className="text-gray-600 mb-4">
              Attendees at Miss Culture Global Kenya events are expected to maintain respectful 
              behavior. Organizers reserve the right to remove any individual whose conduct is 
              deemed inappropriate or disruptive to the event.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on this website, including logos, graphics, and text, is the property of 
              Miss Culture Global Kenya and is protected by intellectual property laws.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              Miss Culture Global Kenya is not liable for any direct or indirect damages arising from 
              your use of our services or attendance at our events, except as required by law.
            </p>
            
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                <strong>Last Updated:</strong> May 7, 2026
              </p>
              <p className="text-gray-500 text-sm mt-2">
                For any legal inquiries, please contact us at{' '}
                <a href="mailto:legal@misscultureglobalkenya.com" className="text-green-600 hover:text-green-700">
                  legal@misscultureglobalkenya.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
