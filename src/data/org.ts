import type { OrgUnit, StaffUser } from '@/types';

/**
 * PWD Chhattisgarh administrative hierarchy.
 *
 * Source: "hierarchy pwd.pdf" (rank chain) + "pwd list.pdf" (officer directory).
 * The PDFs are a flat directory and do not declare parent links, so the tree
 * below is a reasonable State -> Zone -> Circle -> Division -> Sub-Division
 * structure grouped by geography. A representative subset of the 318 listed
 * officers is included so the scoped tree is easy to navigate and demo.
 *
 * Visibility rule (see lib/hierarchy.ts): an officer can see their own unit and
 * everything below it, but never units above or sibling branches.
 */

export const orgUnits: OrgUnit[] = [
  // ---- State (Engineer-in-Chief) ----
  { id: 'org-state', name: 'Chhattisgarh PWD (State HQ)', nameHi: 'छत्तीसगढ़ लोक निर्माण विभाग (राज्य मुख्यालय)', level: 'state', parentId: null, lat: 21.2787, lng: 81.8661 },

  // ---- Zones (Chief Engineers) ----
  { id: 'org-zone-raipur', name: 'Raipur Zone', nameHi: 'रायपुर क्षेत्र', level: 'zone', parentId: 'org-state', lat: 21.2514, lng: 81.6296 },
  { id: 'org-zone-durg', name: 'Durg Zone', nameHi: 'दुर्ग क्षेत्र', level: 'zone', parentId: 'org-state', lat: 21.19, lng: 81.2849 },
  { id: 'org-zone-bilaspur', name: 'Bilaspur Zone', nameHi: 'बिलासपुर क्षेत्र', level: 'zone', parentId: 'org-state', lat: 22.0797, lng: 82.1409 },
  { id: 'org-zone-ambikapur', name: 'Ambikapur Zone', nameHi: 'अंबिकापुर क्षेत्र', level: 'zone', parentId: 'org-state', lat: 23.1186, lng: 83.1956 },
  { id: 'org-zone-bastar', name: 'Bastar Zone', nameHi: 'बस्तर क्षेत्र', level: 'zone', parentId: 'org-state', lat: 19.076, lng: 82.029 },

  // ---- Circles (Superintending Engineers) ----
  { id: 'org-circle-raipur1', name: 'PWD Circle-1, Raipur', nameHi: 'लोनिवि वृत्त-1, रायपुर', level: 'circle', parentId: 'org-zone-raipur', lat: 21.2514, lng: 81.6296 },
  { id: 'org-circle-raipur2', name: 'PWD Circle-2, Raipur', nameHi: 'लोनिवि वृत्त-2, रायपुर', level: 'circle', parentId: 'org-zone-raipur', lat: 21.245, lng: 81.64 },
  { id: 'org-circle-durg', name: 'PWD Circle, Durg', nameHi: 'लोनिवि वृत्त, दुर्ग', level: 'circle', parentId: 'org-zone-durg', lat: 21.19, lng: 81.2849 },
  { id: 'org-circle-bilaspur', name: 'PWD Circle, Bilaspur', nameHi: 'लोनिवि वृत्त, बिलासपुर', level: 'circle', parentId: 'org-zone-bilaspur', lat: 22.0797, lng: 82.1409 },
  { id: 'org-circle-ambikapur', name: 'PWD Circle, Ambikapur', nameHi: 'लोनिवि वृत्त, अंबिकापुर', level: 'circle', parentId: 'org-zone-ambikapur', lat: 23.1186, lng: 83.1956 },
  { id: 'org-circle-bastar', name: 'PWD Bastar Circle, Jagdalpur', nameHi: 'लोनिवि बस्तर वृत्त, जगदलपुर', level: 'circle', parentId: 'org-zone-bastar', lat: 19.076, lng: 82.029 },

  // ---- Divisions (Executive Engineers) ----
  { id: 'org-div-raipur1', name: 'PWD Division No.1, Raipur', nameHi: 'लोनिवि मंडल क्र.1, रायपुर', level: 'division', parentId: 'org-circle-raipur1', lat: 21.2514, lng: 81.6296 },
  { id: 'org-div-raipur2', name: 'PWD Division No.2, Raipur', nameHi: 'लोनिवि मंडल क्र.2, रायपुर', level: 'division', parentId: 'org-circle-raipur1', lat: 21.25, lng: 81.63 },
  { id: 'org-div-raipur3', name: 'PWD Division No.3, Raipur', nameHi: 'लोनिवि मंडल क्र.3, रायपुर', level: 'division', parentId: 'org-circle-raipur2', lat: 21.24, lng: 81.65 },
  { id: 'org-div-balodabazar', name: 'Balodabazar Division', nameHi: 'बलौदाबाजार मंडल', level: 'division', parentId: 'org-circle-raipur2', lat: 21.658, lng: 82.161 },
  { id: 'org-div-durg', name: 'Durg Division', nameHi: 'दुर्ग मंडल', level: 'division', parentId: 'org-circle-durg', lat: 21.19, lng: 81.2849 },
  { id: 'org-div-bemetara', name: 'Bemetara Division', nameHi: 'बेमेतरा मंडल', level: 'division', parentId: 'org-circle-durg', lat: 21.715, lng: 81.534 },
  { id: 'org-div-bilaspur1', name: 'Division No.1, Bilaspur', nameHi: 'मंडल क्र.1, बिलासपुर', level: 'division', parentId: 'org-circle-bilaspur', lat: 22.0797, lng: 82.1409 },
  { id: 'org-div-ambikapur', name: 'Ambikapur Division', nameHi: 'अंबिकापुर मंडल', level: 'division', parentId: 'org-circle-ambikapur', lat: 23.1186, lng: 83.1956 },
  { id: 'org-div-kanker', name: 'Kanker Division', nameHi: 'कांकेर मंडल', level: 'division', parentId: 'org-circle-bastar', lat: 20.271, lng: 81.492 },

  // ---- Sub-Divisions (Sub-Divisional / Assistant Engineers) ----
  { id: 'org-sub-raipur1', name: 'Sub-Division No.1, Raipur', nameHi: 'उपमंडल क्र.1, रायपुर', level: 'subdivision', parentId: 'org-div-raipur1', lat: 21.2514, lng: 81.6296 },
  { id: 'org-sub-arang', name: 'Sub-Division No.4, Raipur (Arang)', nameHi: 'उपमंडल क्र.4, रायपुर (आरंग)', level: 'subdivision', parentId: 'org-div-raipur1', lat: 21.1965, lng: 81.969 },
  { id: 'org-sub-raipur2', name: 'Sub-Division No.2, Raipur', nameHi: 'उपमंडल क्र.2, रायपुर', level: 'subdivision', parentId: 'org-div-raipur2', lat: 21.169, lng: 81.787 },
  { id: 'org-sub-raipur3', name: 'Sub-Division No.3, Raipur', nameHi: 'उपमंडल क्र.3, रायपुर', level: 'subdivision', parentId: 'org-div-raipur3', lat: 21.24, lng: 81.66 },
  { id: 'org-sub-tilda', name: 'Sub-Division Tilda', nameHi: 'उपमंडल तिल्दा', level: 'subdivision', parentId: 'org-div-raipur3', lat: 21.584, lng: 81.717 },
  { id: 'org-sub-balodabazar', name: 'Sub-Division Balodabazar', nameHi: 'उपमंडल बलौदाबाजार', level: 'subdivision', parentId: 'org-div-balodabazar', lat: 21.658, lng: 82.161 },
  { id: 'org-sub-durg1', name: 'Sub-Division No.1, Durg', nameHi: 'उपमंडल क्र.1, दुर्ग', level: 'subdivision', parentId: 'org-div-durg', lat: 21.19, lng: 81.2849 },
  { id: 'org-sub-durg2', name: 'Sub-Division No.2, Durg', nameHi: 'उपमंडल क्र.2, दुर्ग', level: 'subdivision', parentId: 'org-div-durg', lat: 21.21, lng: 81.31 },
  { id: 'org-sub-bemetara', name: 'Sub-Division Bemetara', nameHi: 'उपमंडल बेमेतरा', level: 'subdivision', parentId: 'org-div-bemetara', lat: 21.715, lng: 81.534 },
  { id: 'org-sub-bilaspur1', name: 'Sub-Division No.1, Bilaspur', nameHi: 'उपमंडल क्र.1, बिलासपुर', level: 'subdivision', parentId: 'org-div-bilaspur1', lat: 22.0797, lng: 82.1409 },
  { id: 'org-sub-ambikapur1', name: 'Sub-Division No.1, Ambikapur', nameHi: 'उपमंडल क्र.1, अंबिकापुर', level: 'subdivision', parentId: 'org-div-ambikapur', lat: 23.1186, lng: 83.1956 },
  { id: 'org-sub-kanker', name: 'Sub-Division Kanker', nameHi: 'उपमंडल कांकेर', level: 'subdivision', parentId: 'org-div-kanker', lat: 20.271, lng: 81.492 },
];

/**
 * Officers from the PWD directory mapped onto the tree (subset).
 * Demo login accounts exist at every level (passwords noted on the login
 * screen); remaining officers are directory-only entries (generic password).
 */
const DIRECTORY_PWD = 'pwd123';

export const hierarchyStaff: StaffUser[] = [
  // State — Engineer-in-Chief (sees the entire state)
  {
    id: 'h-einc', name: 'V. K. Bhatpahri', email: 'einc@pwd.cg.gov.in', mobile: '9876510001',
    designation: 'Engineer-in-Chief', role: 'super_admin', divisionIds: [], orgUnitId: 'org-state',
    password: 'einc123', active: true,
  },

  // Zones — Chief Engineers
  {
    id: 'h-ce-raipur', name: 'P. M. Kashyap', email: 'ce.raipur@pwd.cg.gov.in', mobile: '9826173359',
    designation: 'Chief Engineer (Raipur Zone)', role: 'dept_admin', divisionIds: [], orgUnitId: 'org-zone-raipur',
    password: 'ce123', active: true,
  },
  { id: 'h-ce-durg', name: 'N. K. Jayant', email: 'ce.durg@pwd.cg.gov.in', mobile: '9424256713', designation: 'Chief Engineer (Durg Zone)', role: 'dept_admin', divisionIds: [], orgUnitId: 'org-zone-durg', password: DIRECTORY_PWD, active: true },
  { id: 'h-ce-bilaspur', name: 'R. K. Ratre', email: 'ce.bilaspur@pwd.cg.gov.in', mobile: '9753671002', designation: 'Chief Engineer (Bilaspur Zone)', role: 'dept_admin', divisionIds: [], orgUnitId: 'org-zone-bilaspur', password: DIRECTORY_PWD, active: true },
  { id: 'h-ce-ambikapur', name: 'B. S. Baghel', email: 'ce.ambikapur@pwd.cg.gov.in', mobile: '9425258708', designation: 'Chief Engineer (Ambikapur Zone)', role: 'dept_admin', divisionIds: [], orgUnitId: 'org-zone-ambikapur', password: DIRECTORY_PWD, active: true },
  { id: 'h-ce-bastar', name: 'M. L. Uraon', email: 'ce.bastar@pwd.cg.gov.in', mobile: '9826908400', designation: 'Chief Engineer (Bastar Zone)', role: 'dept_admin', divisionIds: [], orgUnitId: 'org-zone-bastar', password: DIRECTORY_PWD, active: true },

  // Circles — Superintending Engineers
  {
    id: 'h-se-raipur1', name: 'D. K. Netam', email: 'se.raipur1@pwd.cg.gov.in', mobile: '9424280055',
    designation: 'Superintending Engineer (Circle-1, Raipur)', role: 'division_officer', divisionIds: ['div-raipur'], orgUnitId: 'org-circle-raipur1',
    password: 'se123', active: true,
  },
  { id: 'h-se-raipur2', name: 'Virendra Kumar Singh', email: 'se.raipur2@pwd.cg.gov.in', mobile: '9406368000', designation: 'Superintending Engineer (Circle-2, Raipur)', role: 'division_officer', divisionIds: ['div-raipur'], orgUnitId: 'org-circle-raipur2', password: DIRECTORY_PWD, active: true },
  { id: 'h-se-durg', name: 'B. K. Patoria', email: 'se.durg@pwd.cg.gov.in', mobile: '7882210876', designation: 'Superintending Engineer (Circle, Durg)', role: 'division_officer', divisionIds: ['div-durg'], orgUnitId: 'org-circle-durg', password: DIRECTORY_PWD, active: true },
  { id: 'h-se-bilaspur', name: 'Khelan Prasad Sant', email: 'se.bilaspur@pwd.cg.gov.in', mobile: '9425261063', designation: 'Superintending Engineer (Circle, Bilaspur)', role: 'division_officer', divisionIds: ['div-bilaspur'], orgUnitId: 'org-circle-bilaspur', password: DIRECTORY_PWD, active: true },
  { id: 'h-se-ambikapur', name: 'Mahadev Lahre', email: 'se.ambikapur@pwd.cg.gov.in', mobile: '7697309107', designation: 'Superintending Engineer (Circle, Ambikapur)', role: 'division_officer', divisionIds: ['div-ambikapur'], orgUnitId: 'org-circle-ambikapur', password: DIRECTORY_PWD, active: true },
  { id: 'h-se-bastar', name: 'Sanjay Suryawanshi', email: 'se.bastar@pwd.cg.gov.in', mobile: '8349062299', designation: 'Superintending Engineer (Bastar Circle, Jagdalpur)', role: 'division_officer', divisionIds: ['div-jagdalpur'], orgUnitId: 'org-circle-bastar', password: DIRECTORY_PWD, active: true },

  // Divisions — Executive Engineers
  {
    id: 'h-ee-raipur1', name: 'Rajeev Nashine', email: 'ee.raipur1@pwd.cg.gov.in', mobile: '9425503818',
    designation: 'Executive Engineer (Division No.1, Raipur)', role: 'division_officer', divisionIds: ['div-raipur'], orgUnitId: 'org-div-raipur1',
    password: 'ee123', active: true,
  },
  { id: 'h-ee-raipur2', name: 'Prabhat Kumar Saxena', email: 'ee.raipur2@pwd.cg.gov.in', mobile: '7587017248', designation: 'Executive Engineer (Division No.2, Raipur)', role: 'division_officer', divisionIds: ['div-raipur'], orgUnitId: 'org-div-raipur2', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-raipur3', name: 'Abhinav Shrivastava', email: 'ee.raipur3@pwd.cg.gov.in', mobile: '7587017249', designation: 'Executive Engineer (Division No.3, Raipur)', role: 'division_officer', divisionIds: ['div-raipur'], orgUnitId: 'org-div-raipur3', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-balodabazar', name: 'Anuj Sharma', email: 'ee.balodabazar@pwd.cg.gov.in', mobile: '9425213225', designation: 'Executive Engineer (Balodabazar Division)', role: 'division_officer', divisionIds: ['div-raipur'], orgUnitId: 'org-div-balodabazar', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-durg', name: 'Aashish Kumar Bhattacharya', email: 'ee.durg@pwd.cg.gov.in', mobile: '7587017256', designation: 'Executive Engineer (Durg Division)', role: 'division_officer', divisionIds: ['div-durg'], orgUnitId: 'org-div-durg', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-bemetara', name: 'D. K. Chandel', email: 'ee.bemetara@pwd.cg.gov.in', mobile: '7587017258', designation: 'Executive Engineer (Bemetara Division)', role: 'division_officer', divisionIds: ['div-durg'], orgUnitId: 'org-div-bemetara', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-bilaspur1', name: 'C. S. Vindhraj', email: 'ee.bilaspur1@pwd.cg.gov.in', mobile: '9977822669', designation: 'Executive Engineer (Division No.1, Bilaspur)', role: 'division_officer', divisionIds: ['div-bilaspur'], orgUnitId: 'org-div-bilaspur1', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-ambikapur', name: 'Virendra Choudhari', email: 'ee.ambikapur@pwd.cg.gov.in', mobile: '9407633009', designation: 'Executive Engineer (Ambikapur Division)', role: 'division_officer', divisionIds: ['div-ambikapur'], orgUnitId: 'org-div-ambikapur', password: DIRECTORY_PWD, active: true },
  { id: 'h-ee-kanker', name: 'K. K. Saral', email: 'ee.kanker@pwd.cg.gov.in', mobile: '8435380534', designation: 'Executive Engineer (Kanker Division)', role: 'division_officer', divisionIds: ['div-jagdalpur'], orgUnitId: 'org-div-kanker', password: DIRECTORY_PWD, active: true },

  // Sub-Divisions — Sub-Divisional / Assistant Engineers (field officers)
  {
    id: 'h-sdo-arang', name: 'Mohit Kumar Sahu', email: 'sdo.arang@pwd.cg.gov.in', mobile: '8878166618',
    designation: 'Sub-Divisional Officer (Arang)', role: 'complaint_handler', divisionIds: ['div-raipur'], orgUnitId: 'org-sub-arang',
    password: 'sdo123', active: true,
  },
  { id: 'h-sdo-raipur1', name: 'Ashish Ngpure', email: 'sdo.raipur1@pwd.cg.gov.in', mobile: '9425206554', designation: 'Sub-Divisional Officer (Sub-Div No.1, Raipur)', role: 'complaint_handler', divisionIds: ['div-raipur'], orgUnitId: 'org-sub-raipur1', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-raipur2', name: 'Keshav Kumar Sharma', email: 'sdo.raipur2@pwd.cg.gov.in', mobile: '9993952753', designation: 'Sub-Divisional Officer (Sub-Div No.2, Raipur)', role: 'complaint_handler', divisionIds: ['div-raipur'], orgUnitId: 'org-sub-raipur2', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-raipur3', name: 'J. K. Sahu', email: 'sdo.raipur3@pwd.cg.gov.in', mobile: '9826308550', designation: 'Sub-Divisional Officer (Sub-Div No.3, Raipur)', role: 'complaint_handler', divisionIds: ['div-raipur'], orgUnitId: 'org-sub-raipur3', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-tilda', name: 'Ahammad Nawaz Danish', email: 'sdo.tilda@pwd.cg.gov.in', mobile: '8319072123', designation: 'Sub-Divisional Officer (Tilda)', role: 'complaint_handler', divisionIds: ['div-raipur'], orgUnitId: 'org-sub-tilda', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-balodabazar', name: 'M. L. Nayak', email: 'sdo.balodabazar@pwd.cg.gov.in', mobile: '9753783052', designation: 'Sub-Divisional Officer (Balodabazar)', role: 'complaint_handler', divisionIds: ['div-raipur'], orgUnitId: 'org-sub-balodabazar', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-durg1', name: 'Shyamsundar Sahu', email: 'sdo.durg1@pwd.cg.gov.in', mobile: '9893074296', designation: 'Sub-Divisional Officer (Sub-Div No.1, Durg)', role: 'complaint_handler', divisionIds: ['div-durg'], orgUnitId: 'org-sub-durg1', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-durg2', name: 'Abhishek Meshram', email: 'sdo.durg2@pwd.cg.gov.in', mobile: '9425246497', designation: 'Sub-Divisional Officer (Sub-Div No.2, Durg)', role: 'complaint_handler', divisionIds: ['div-durg'], orgUnitId: 'org-sub-durg2', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-bemetara', name: 'Rajesh Kumar Bajpai', email: 'sdo.bemetara@pwd.cg.gov.in', mobile: '9425558618', designation: 'Sub-Divisional Officer (Bemetara)', role: 'complaint_handler', divisionIds: ['div-durg'], orgUnitId: 'org-sub-bemetara', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-bilaspur1', name: 'Aditya Grover', email: 'sdo.bilaspur1@pwd.cg.gov.in', mobile: '9691431999', designation: 'Sub-Divisional Officer (Sub-Div No.1, Bilaspur)', role: 'complaint_handler', divisionIds: ['div-bilaspur'], orgUnitId: 'org-sub-bilaspur1', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-ambikapur1', name: 'Amarchand Bara', email: 'sdo.ambikapur1@pwd.cg.gov.in', mobile: '7974812931', designation: 'Sub-Divisional Officer (Sub-Div No.1, Ambikapur)', role: 'complaint_handler', divisionIds: ['div-ambikapur'], orgUnitId: 'org-sub-ambikapur1', password: DIRECTORY_PWD, active: true },
  { id: 'h-sdo-kanker', name: 'Maniram Markam', email: 'sdo.kanker@pwd.cg.gov.in', mobile: '7694008050', designation: 'Sub-Divisional Officer (Kanker)', role: 'complaint_handler', divisionIds: ['div-jagdalpur'], orgUnitId: 'org-sub-kanker', password: DIRECTORY_PWD, active: true },

  // Demo showcase account (listed last so it is not shown as a unit head):
  // full state visibility AND bypasses the on-site GPS lock so progress can be
  // captured from anywhere during a demo.
  {
    id: 'h-demo', name: 'Demo Officer (Showcase)', email: 'demo@pwd.cg.gov.in', mobile: '9000000000',
    designation: 'Field Demo / All-Access', role: 'super_admin', divisionIds: [], orgUnitId: 'org-state',
    demoOverride: true, password: 'demo123', active: true,
  },
];
