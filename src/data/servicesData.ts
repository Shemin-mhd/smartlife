import { ServiceItem, DocumentChecklist } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'family-visa',
    title: 'All Emirates Family Visa Services (New / Renewal)',
    category: 'visas',
    categoryLabel: 'Visas & Immigration',
    shortDesc: 'Comprehensive family residence visa application, entry permit, medical fitness typing, and Emirates ID processing across all 7 Emirates.',
    fullDesc: 'We assist sponsors in bringing their spouse, children, or parents to the UAE. We handle the complete procedure across Dubai, Sharjah, Abu Dhabi, Ajman, RAK, Fujairah, and Umm Al Quwain, including file opening, salary certificate validation, lease agreement (Ejari/Moulqad), medical typing, and Emirates ID.',
    requiredDocuments: [
      'Sponsor Passport Copy, Residence Visa Copy &  Emirates ID Copy',
      'Sponsor Salary Certificate / Labour Contract (Minimum salary AED 4,000 )',
      'Registered Tenancy Contract (Tenancy / Ejari / Municipal Registered Lease)',
      'Dependents Passport Copies (valid at least 6 months) & Passport Photographs (white background)',
      'Attested Marriage Certificate (for Spouse) & Attested Birth Certificates (for Children)',
      'Sponsor Bank Statements (3 to 6 months if required by immigration)'
    ],
    processingTime: '2 - 5 Working Days',
    isPopular: true,
    keywords: ['family visa Dubai', 'family visa Sharjah', 'dependents visa renewal', 'family residency UAE', 'Ejari family visa'],
    officialPortalUrl: 'https://smartservices.icp.gov.ae',
    officialPortalName: 'ICP UAE Federal Authority'
  },
  {
    id: 'tourist-visit-visa',
    title: 'UAE Tourist Visa & Visit Visa Services',
    category: 'visas',
    categoryLabel: 'Visas & Immigration',
    shortDesc: 'Fast-track 30-day and 60-day tourist visas, single and multiple entry visit visa applications with professional document check.',
    fullDesc: 'Get fast approval for UAE tourist and visit visas for family members, friends, or business visitors. We provide quick documentation verification, guaranteed typing accuracy, and extensions without hassle.',
    requiredDocuments: [
      'Visitor Passport Copy (Minimum 6 months validity)',
      'Recent Passport-Size Photograph (White Background)',
      'Guarantor Passport & Residence Visa Copy (If applicable)',
      'Return Flight Ticket Reservation (If requested)',
      'Hotel Booking / Host Residency Proof'
    ],
    processingTime: '24 - 48 Hours',
    isPopular: true,
    keywords: ['UAE tourist visa', '30 days visit visa', '60 days visit visa Sharjah', 'visit visa extension', 'Dubai tourist visa'],
    officialPortalUrl: 'https://gdrfad.gov.ae',
    officialPortalName: 'GDRFA Portal'
  },
  {
    id: 'labour-visa',
    title: 'Labour Visa Services (New / Renewal)',
    category: 'visas',
    categoryLabel: 'Visas & Immigration',
    shortDesc: 'MoHRE labour contract typing, work permit entry processing, medical fitness, labor visa renewals, and status modifications.',
    fullDesc: 'Complete employment/labour visa services for workers and company personnel. We handle MoHRE work permit issuance, offer letter typing, contract renewals, quota approvals, labor cancellations, and work permit amendments.',
    requiredDocuments: [
      'Employee Passport Copy & Photo',
      'Company Trade License Copy',
      'Establishment Card Copy',
      'Educational Certificate Copy (Attested for skilled categories)',

    ],
    processingTime: '3 - 5 Working Days',
    isPopular: true,
    keywords: ['MoHRE work permit', 'labour visa Sharjah', 'employment visa typing', 'Tasheel typing Sharjah', 'labour contract renewal'],
    officialPortalUrl: 'https://www.mohre.gov.ae',
    officialPortalName: 'MoHRE Portal'
  },
  {
    id: 'indian-passport-renewal',
    title: 'Indian Passport Renewal Services (BLS Approved)',
    category: 'indian_consulate',
    categoryLabel: 'BLS Indian Consulate',
    shortDesc: 'Complete Indian passport renewal, minor passport application, Tatkaal typing, photo formatting, and BLS form preparation.',
    fullDesc: 'Expert assistance for Indian passport renewals across Sharjah and the UAE. We prepare BLS online application forms, verify original documents, format 51mm x 51mm white background photographs, and draft affidavit letters.',
    requiredDocuments: [
      'Original Indian Passport & Residence Visa Copy',
      'Original Emirates ID Card',
      '51mm x 51mm White Background Photographs',
      'Address Proof (Aadhaar / Utility Bill / Indian Election Card for address changes)',
      'Spouse Passport Copy (for spouse name endorsement)',
      'UAE Mobile Number and Delivery Address',
      'UAE Emergency Contact (Family Member of Friend)'
    ],
    processingTime: '3 - 7 Working Days',
    isPopular: true,
    keywords: ['Indian passport renewal Sharjah', 'BLS typing Sharjah', 'Indian consulate passport renewal', 'Tatkaal Indian passport Dubai'],
    officialPortalUrl: 'https://www.blsindiavisa-uae.com',
    officialPortalName: 'BLS International UAE'
  },
  {
    id: 'certificate-attestation',
    title: 'Certificate Attestation Services (MOFA & Embassy)',
    category: 'attestation_legal',
    categoryLabel: 'Certificate Attestation',
    shortDesc: 'Degree certificate, diploma, marriage certificate, birth certificate, and commercial document legal attestation via MoFA UAE.',
    fullDesc: 'Legal attestation services for educational and personal documents required for UAE residence visas, job promotions, and university admissions. We coordinate home country Ministry attestation, UAE Embassy stamping, and MoFA UAE final verification.',
    requiredDocuments: [
      'Original Certificate / Degree / Diploma / Marksheets',
      'Passport Copy of Document Owner (If Required)',
      'Emirates ID Copy (If Required)',
      'Authorization Letter (if applicable)'
    ],
    processingTime: '5 - 10 Working Days',
    isPopular: false,
    keywords: ['certificate attestation Sharjah', 'degree attestation MOFA', 'marriage certificate attestation UAE', 'birth certificate attestation'],
    officialPortalUrl: 'https://www.mofa.gov.ae',
    officialPortalName: 'Ministry of Foreign Affairs UAE'
  },
  {
    id: 'emirates-id-typing',
    title: 'Emirates ID Typing & Medical Fitness Application',
    category: 'government',
    categoryLabel: 'Government Services',
    shortDesc: 'ICP Emirates ID typing for new residence visas, renewals, and medical fitness screening appointment booking.',
    fullDesc: 'Official Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) Emirates ID form typing. We book biometric appointments and health ministry medical fitness screening test slots.',
    requiredDocuments: [
      'Passport Copy & Entry Permit / Current Visa Copy',
      'Old Emirates ID Card (for renewals)',
      'Passport Photograph with White Background',
      'Active Mobile Number and Email ID'
    ],
    processingTime: 'Same Day / 24 Hours',
    isPopular: false,
    keywords: ['Emirates ID renewal Sharjah', 'ICP Emirates ID typing', 'medical fitness typing Sharjah', 'biometric appointment booking'],
    officialPortalUrl: 'https://smartservices.icp.gov.ae',
    officialPortalName: 'ICP Smart Services'
  },
  {
    id: 'company-setup-pro',
    title: 'Company Formation & Business PRO Services',
    category: 'corporate',
    categoryLabel: 'Corporate Services',
    shortDesc: 'Trade license issuance & renewal, Economic Development Department typing, Establishment Card, and Corporate PRO solutions.',
    fullDesc: 'End-to-end corporate services for business owners and investors in Sharjah and Dubai. We assist with SEDD trade license renewals, Memorandum of Association (MOA) typing, civil work permits, and investor visa processing.',
    requiredDocuments: [
      'Trade License Copy / Initial Approval',
      'Partners / Investor Passport Copies & Emirates IDs',
      'Lease Agreement (Tenancy / Ejari / SEDD Contract)',
      'Establishment Card'
    ],
    processingTime: '2 - 5 Working Days',
    isPopular: false,
    keywords: ['SEDD trade license Sharjah', 'company formation Sharjah', 'PRO services Sharjah', 'establishment card renewal'],
    officialPortalUrl: 'https://sedd.ae',
    officialPortalName: 'Sharjah Economic Development Dept'
  },
  {
    id: 'saudi-visa-typing',
    title: 'Saudi Arabia Tourist & GCC Resident E-Visa Typing',
    category: 'visas',
    categoryLabel: 'Visas & Immigration',
    shortDesc: 'E-visa application typing for GCC residents visiting Saudi Arabia for tourism, Umrah, or business.',
    fullDesc: 'Fast-track Saudi tourist and multiple-entry e-visa processing for UAE residents. We ensure error-free online typing and instant confirmation for road or air travel.',
    requiredDocuments: [
      'Applicant Passport Copy (Valid minimum 6 months)',
      'Valid UAE Residence Visa (Valid minimum 3 months)',
      'Passport Photograph with White Background',
    ],
    processingTime: '24 - 48 Hours',
    isPopular: false,
    keywords: ['Saudi visa for UAE residents', 'Saudi tourist visa typing', 'Umrah visa typing Sharjah', 'Saudi e-visa Sharjah'],
    officialPortalUrl: 'https://visa.mofa.gov.sa',
    officialPortalName: 'Saudi MOFA Portal'
  },
  {
    id: 'police-clearance-certificate',
    title: 'Police Clearance Certificate Services',
    category: 'government',
    categoryLabel: 'Government Services',
    shortDesc: 'Assistance in obtaining UAE Police Clearance Certificates (Good Conduct Certificate) from Sharjah Police & Ministry of Interior.',
    fullDesc: 'We help current and former UAE residents obtain Good Conduct / Police Clearance Certificates online through Ministry of Interior (MOI) and Sharjah Police applications for immigration, jobs, or study abroad.',
    requiredDocuments: [
      'Emirates ID Copy (or Unified Number for former residents)',
      'Passport Copy',

    ],
    processingTime: '24 - 48 Hours',
    isPopular: false,
    keywords: ['Police Clearance Certificate Sharjah', 'Good conduct certificate UAE', 'Sharjah Police PCC', 'MOI PCC typing'],
    officialPortalUrl: 'https://www.moi.gov.ae',
    officialPortalName: 'Ministry of Interior UAE'
  }
];

export const DOCUMENT_CHECKLISTS: DocumentChecklist[] = [
  {
    serviceId: 'family-visa',
    title: 'Family Residence Visa Checklist',
    documents: [
      { name: 'Sponsor Original Passport & Residence Visa Copy', isMandatory: true, description: 'Sponsor visa must have at least 6 months validity remaining.' },
      { name: 'Sponsor Original Emirates ID', isMandatory: true, description: 'Required for ICP portal authentication and typing.' },
      { name: 'Salary Certificate / Labor Contract', isMandatory: true, description: 'Minimum salary AED 4,000 or AED 3,000 + accommodation.' },
      { name: 'Sharjah Municipal Tenancy Contract (Ejari/Moulqad)', isMandatory: true, description: 'Must be in the sponsor name and active.' },
      { name: 'SEWA Utility Bill', isMandatory: true, description: 'Recent electricity & water bill under tenancy contract.' },
      { name: 'Attested Marriage Certificate', isMandatory: true, description: 'Attested by MoFA UAE and home country ministry.' },
      { name: 'Attested Birth Certificate(s)', isMandatory: true, description: 'For children sponsorship, carrying MoFA legal stamps.' },
      { name: 'Dependents Passport Copies & Photos', isMandatory: true, description: 'Passports valid minimum 6 months with white background photos.' },
      { name: '3-6 Months Bank Statement', isMandatory: false, description: 'Conditional depending on designation or immigration request.' }
    ],
    notes: [
      'All non-Arabic/English certificates must be translated into certified Arabic legal translation.',
      'Sponsor designation in labor contract must meet federal eligibility criteria.'
    ]
  },
  {
    serviceId: 'indian-passport-renewal',
    title: 'Indian Passport Renewal (BLS) Checklist',
    documents: [
      { name: 'Original Indian Passport', isMandatory: true, description: 'Current passport along with first and last page copies.' },
      { name: 'Valid UAE Residence Visa Copy', isMandatory: true, description: 'Current valid residency page or digital visa copy.' },
      { name: 'Original Emirates ID Card', isMandatory: true, description: 'Mandatory for identity verification at BLS counter.' },
      { name: '51mm x 51mm White Background Photo', isMandatory: true, description: 'Specific studio format required for Indian passport.' },
      { name: 'Address Proof (if changing address)', isMandatory: false, description: 'Aadhaar, utility bill, or Indian election card copy.' },
      { name: 'Spouse Passport Copy', isMandatory: false, description: 'Required for adding spouse name endorsement.' }
    ],
    notes: [
      'Minors passport renewal requires both parents original passports and Emirates IDs.',
      'Tatkaal scheme requires additional emergency justification letters.'
    ]
  },
  {
    serviceId: 'certificate-attestation',
    title: 'Certificate Legal Attestation Checklist',
    documents: [
      { name: 'Original Degree / Diploma / Certificate', isMandatory: true, description: 'Must be verified by issuing university or board.' },
      { name: 'Home Country HRD & MEA Stamp', isMandatory: true, description: 'State education department and Ministry of External Affairs verification.' },
      { name: 'UAE Embassy Stamp in Home Country', isMandatory: true, description: 'Affixed before sending document to the UAE.' },
      { name: 'MoFA UAE Final Legal Stamp', isMandatory: true, description: 'Final authentication by Ministry of Foreign Affairs UAE.' },
      { name: 'Passport & Emirates ID Copy', isMandatory: true, description: 'Of the document owner.' }
    ],
    notes: [
      'Smart Life offers complete end-to-end attestation courier pickup and delivery.'
    ]
  },
  {
    serviceId: 'emirates-id-typing',
    title: 'Emirates ID & Medical Typing Checklist',
    documents: [
      { name: 'Applicant Passport Copy', isMandatory: true, description: 'Valid for at least 6 months.' },
      { name: 'Entry Permit / Visa Copy', isMandatory: true, description: 'Electronic entry permit or current residence visa.' },
      { name: 'Old Emirates ID Card', isMandatory: false, description: 'For renewal applications.' },
      { name: 'Passport Photograph', isMandatory: true, description: 'High resolution digital white background photo.' },
      { name: 'Active Mobile Number', isMandatory: true, description: 'For ICP OTP verification code.' }
    ]
  },
  {
    serviceId: 'labour-visa',
    title: 'MoHRE Work Permit & Labour Contract Checklist',
    documents: [
      { name: 'Employee Passport Copy & Photo', isMandatory: true, description: 'Clear color copy.' },
      { name: 'Company Trade License Copy', isMandatory: true, description: 'Valid Sharjah / UAE trade license.' },
      { name: 'Establishment Card Copy', isMandatory: true, description: 'Active company establishment card.' },
      { name: 'Attested Educational Degree', isMandatory: false, description: 'Required for skilled manager/engineer professions.' },
      { name: 'Signed Offer Letter', isMandatory: true, description: 'MoHRE electronic offer letter template.' }
    ]
  }
];
