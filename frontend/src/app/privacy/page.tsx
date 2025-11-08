'use client'

import { motion } from 'framer-motion'
import PageHeader from '@/components/PageHeader'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageHeader 
        title="Privacy Policy" 
        subtitle="Your privacy is important to us"
        backgroundImage="/images/hero-bg.jpg"
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
              This Privacy Policy describes how Miss Culture Global Kenya ("we", "our", or "us") 
              collects, uses, and shares your personal information when you visit our website 
              misscultureglobalkenya.com (the "Site").
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We may collect information you provide directly to us, such as when you contact us, 
              register for events, or subscribe to our newsletter. This information may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Your name and contact information</li>
              <li>Payment information when purchasing tickets or making donations</li>
              <li>Photographs and videos taken at our events</li>
              <li>Information you provide in surveys or feedback forms</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Personalize your experience on our Site</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Sharing Your Information</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to outside 
              parties without your consent, except as described in this policy or as required by law.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect the security 
              of your personal information. However, no method of transmission over the Internet or 
              electronic storage is 100% secure.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the effective date below.
            </p>
            
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                <strong>Effective Date:</strong> January 1, 2025
              </p>
              <p className="text-gray-500 text-sm mt-2">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:info@misscultureglobalkenya.com" className="text-green-600 hover:text-green-700">
                  info@misscultureglobalkenya.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}