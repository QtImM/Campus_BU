import { CampusLocation } from '../types';

export const CAMPUS_BUILDINGS: CampusLocation[] = [
    // Ho Sin Hang Campus (HSHC)
    {
        id: 'hshc-ach',
        name: 'Academic Community Hall (ACH)',
        category: 'Other',
        coordinates: { latitude: 22.3410, longitude: 114.1792 },
        description: 'Main Hall',
        imageUrl: 'https://Example.com/ach.jpg'
    },
    {
        id: 'hshc-lmc',
        name: 'Lui Ming Choi Centre (LMC)',
        category: 'Study',
        coordinates: { latitude: 22.3408, longitude: 114.1793 },
        description: 'Classrooms and labs',
        imageUrl: 'https://Example.com/lmc.jpg'
    },
    {
        id: 'hshc-oew',
        name: 'Oen Hall West Wing (OEW)',
        category: 'Other',
        coordinates: { latitude: 22.3406, longitude: 114.1789 },
        description: 'West Wing',
        imageUrl: 'https://Example.com/oe.jpg'
    },
    {
        id: 'hshc-oee',
        name: 'Oen Hall East Wing (OEE)',
        category: 'Other',
        coordinates: { latitude: 22.3406, longitude: 114.1791 },
        description: 'East Wing',
        imageUrl: 'https://Example.com/oe.jpg'
    },
    {
        id: 'hshc-oem',
        name: 'Oen Hall Main Building (OEM)',
        category: 'Other',
        coordinates: { latitude: 22.3406, longitude: 114.1790 },
        description: 'Main Building',
        imageUrl: 'https://Example.com/oe.jpg'
    },
    {
        id: 'hshc-rrs',
        name: 'Sir Run Run Shaw Building (RRS)',
        category: 'Study',
        coordinates: { latitude: 22.34034, longitude: 114.17969 },
        description: 'Administrative offices',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'hshc-ash',
        name: 'Au Shue Hung Building (ASH)',
        category: 'Study',
        coordinates: { latitude: 22.3406, longitude: 114.1795 },
        description: 'Classrooms',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'hshc-stb',
        name: 'Sing Tao Building (STB)',
        category: 'Study',
        coordinates: { latitude: 22.3407, longitude: 114.1798 },
        description: 'Communication/Journalism',
        imageUrl: 'https://Example.com/stb.jpg'
    },
    {
        id: 'hshc-cec',
        name: 'Christian Education Centre (CEC)',
        category: 'Other',
        coordinates: { latitude: 22.3405, longitude: 114.1800 },
        description: 'Chapel and offices',
        imageUrl: 'https://Example.com/cec.jpg'
    },
    {
        id: 'hshc-sct',
        name: 'Cha Chi-ming Science Tower (SCT)',
        category: 'Study',
        coordinates: { latitude: 22.3402, longitude: 114.1795 },
        description: 'Science labs',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'hshc-yss',
        name: 'Yeung Shui Sang Building (YSS)',
        category: 'Study',
        coordinates: { latitude: 22.3401, longitude: 114.1797 },
        description: 'Student services',
        imageUrl: 'https://Example.com/yss.jpg'
    },
    {
        id: 'hshc-fsc',
        name: 'Fong Shu Chuen Library (FSC)',
        category: 'Study',
        coordinates: { latitude: 22.3400, longitude: 114.1798 },
        description: 'Library',
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'hshc-whs',
        name: 'Wai Hang Sports Centre (WHS)',
        category: 'Sports',
        coordinates: { latitude: 22.3395, longitude: 114.1802 },
        description: 'Sports hall and pool',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'hshc-sph',
        name: 'Shiu Pong Hall (SPH)',
        category: 'Other',
        coordinates: { latitude: 22.3404, longitude: 114.1805 },
        description: 'Staff quarters/offices',
        imageUrl: 'https://Example.com/sph.jpg'
    },

    // Shaw Campus (SC)
    {
        id: 'sc-swt',
        name: 'Shaw Tower (SWT)',
        category: 'Other',
        coordinates: { latitude: 22.3375, longitude: 114.1812 },
        description: 'Admin offices',
        imageUrl: 'https://Example.com/swt.jpg'
    },
    {
        id: 'sc-aml',
        name: 'Au Shue Hung Memorial Library (AML)',
        category: 'Study',
        coordinates: { latitude: 22.3374, longitude: 114.1812 },
        description: 'Main Library',
        imageUrl: 'https://Example.com/aml.jpg'
    },
    {
        id: 'sc-jsc',
        name: 'Joint Sports Centre (JSC)',
        category: 'Sports',
        coordinates: { latitude: 22.3370, longitude: 114.1808 },
        description: 'Joint university sports centre',
        imageUrl: 'https://Example.com/jsc.jpg'
    },
    {
        id: 'sc-wlb',
        name: 'The Wing Lung Bank Building (WLB)',
        category: 'Study',
        coordinates: { latitude: 22.33689, longitude: 114.18152 },
        description: 'Business School',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'sc-lw',
        // Wait, map text: "Lam Woo International Conference Centre". No abbreviation shown.
        // I'll use (LW) for now.
        name: 'Lam Woo Int. Conf. Centre (LW)',
        category: 'Other',
        coordinates: { latitude: 22.3369, longitude: 114.1816 },
        description: 'Conference centre',
        imageUrl: 'https://Example.com/lw.jpg'
    },
    {
        id: 'sc-dlb',
        name: 'David C. Lam Building (DLB)',
        category: 'Study',
        coordinates: { latitude: 22.33717, longitude: 114.18171 },
        description: 'General classrooms',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=60'
    },

    // Baptist University Road Campus (BURC)
    {
        id: 'burc-aab',
        name: 'Academic and Admin Bldg (AAB)',
        category: 'Study',
        coordinates: { latitude: 22.33682, longitude: 114.18225 },
        description: 'Main building',
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'burc-acc',
        name: 'Jockey Club ACC (ACC)',
        category: 'Study',
        coordinates: { latitude: 22.33602, longitude: 114.18155 },
        description: 'Academic Community Centre',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'burc-scm',
        name: 'Jockey Club SCM Bldg (SCM)',
        category: 'Study',
        coordinates: { latitude: 22.3358, longitude: 114.1820 },
        description: 'Chinese Medicine',
        imageUrl: 'https://Example.com/scm.jpg'
    },
    {
        id: 'burc-cva',
        name: 'Comm. and Visual Arts (CVA)',
        category: 'Study',
        coordinates: { latitude: 22.3362, longitude: 114.1828 },
        description: 'Visual Arts',
        imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'burc-ntt',
        name: 'Dr. Ng Tor Taihouse (NTT)',
        category: 'Other',
        coordinates: { latitude: 22.33639, longitude: 114.18139 },
        description: 'Guest House',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'burc-srh',
        name: 'Student Residence Halls (SRH)',
        category: 'Other',
        coordinates: { latitude: 22.33475, longitude: 114.18165 },
        description: 'Undergraduate Halls',
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'burc-scc',
        name: 'Madam Kwok Chung Bo Fun Ctr (SCC)',
        category: 'Sports',
        coordinates: { latitude: 22.3365, longitude: 114.1830 },
        description: 'Sports and Cultural Centre',
        imageUrl: 'https://Example.com/scc.jpg'
    }
];
