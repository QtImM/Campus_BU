export type FoodOutlet = {
    id: string;
    title: string;
    location: string;
    image: any;
    hours: string;
    orderUrl?: string;
    menuUrl?: string;
    category: string;
    status: 'Open' | 'Closed';
};

export const FOOD_OUTLETS: FoodOutlet[] = [
    {
        id: 'o1',
        title: 'Main Canteen',
        location: 'Level 5, AAB, BUR Campus',
        image: require('../assets/images/food/Main-Canteen.png'),
        hours: 'Mon - Fri: 07:30 - 20:00, Sat: 08:30 - 17:00',
        orderUrl: 'https://csd2.order.place/store/112867/mode/prekiosk',
        menuUrl: 'https://eo.hkbu.edu.hk/content/dam/eo-assets/our-services/landing/catering-services/maxim%27s/2024%2005%20Catering%20Menu_Main%20Canteen%20(Maxims).pdf',
        category: 'Fast Food',
        status: 'Open',
    },
    {
        id: 'o2',
        title: 'iCafe (Pacific Coffee)',
        location: 'Level 3, WLB Building, Shaw Campus',
        image: require('../assets/images/food/iCafe.png'),
        hours: 'Mon - Fri: 08:00 - 20:00, Sat: 08:00 - 18:00, Sun: 08:00 - 17:00',
        menuUrl: 'https://www.pacificcoffee.com/FreshCuisine/index.html',
        category: 'Coffee & Snacks',
        status: 'Open',
    },
    {
        id: 'o3',
        title: 'Chapter Coffee @ UG/F',
        location: 'UG/F, Jockey Club Campus of Creativity',
        image: require('../assets/images/food/Chapter-Coffee@JCCC-UGF-Cafe.png'),
        hours: 'Mon - Fri: 08:00 - 20:00, Sat - Sun: 09:00 - 17:00',
        orderUrl: 'https://app.eats365pos.com/hk/tc/chaptercoffee_kowloontong/menu',
        category: 'Coffee/Bakery',
        status: 'Open',
    },
    {
        id: 'o4',
        title: 'Chapter Coffee @ G/F',
        location: 'G/F, Jockey Club Campus of Creativity',
        image: require('../assets/images/food/Chapter-Coffee@JCCC-GF-Cafe.png'),
        hours: 'Mon - Fri: 08:00 - 21:30, Sat - Sun: 08:00 - 20:00',
        category: 'Coffee/Bakery',
        status: 'Open',
    },
    {
        id: 'o5',
        title: 'Harmony Cafeteria',
        location: 'Level 4, Sir Run Run Shaw Building, HSH Campus',
        image: require('../assets/images/food/Harmony-Cafeteria.png'),
        hours: 'Mon - Fri: 07:30 - 19:30, Sat: 08:00 - 17:00',
        orderUrl: 'https://food.order.place/home/store/5768631610769408?mode=prekiosk',
        category: 'Fast Food',
        status: 'Open',
    },
    {
        id: 'o6',
        title: 'Harmony Lounge',
        location: 'Level 4, Sir Run Run Shaw Building, HSH Campus',
        image: require('../assets/images/food/Harmony-Lounge.png'),
        hours: 'Mon - Fri: 08:00 - 18:00',
        menuUrl: 'https://eo.hkbu.edu.hk/content/dam/eo-assets/our-services/landing/catering-services/the-street-cafe/menu/2025%2009%20menu%20the%20street%20cafe.pdf',
        category: 'Cafe/Lounge',
        status: 'Open',
    },
    {
        id: 'o7',
        title: 'Nan Yuan',
        location: 'Level 2, David C. Lam Building, Shaw Campus',
        image: require('../assets/images/food/NanYuan.png'),
        hours: 'Mon - Fri: 11:00 - 22:00, Sat - Sun: 10:00 - 22:00',
        category: 'Chinese Cuisine',
        status: 'Open',
    },
    {
        id: 'o8',
        title: 'H.F.C.@Scholars Court',
        location: 'Level 2, David C. Lam Building, Shaw Campus',
        image: require('../assets/images/food/H.F.C.@Scholars-Court.png'),
        hours: 'Mon - Fri: 08:00 - 18:00',
        category: 'International',
        status: 'Open',
    },
    {
        id: 'o9',
        title: 'Bistro NTT',
        location: 'G/F, NTT International House, BUR Campus',
        image: require('../assets/images/food/Bistro-NTT.png'),
        hours: 'Mon - Fri: 08:00 - 22:00, Sat - Sun: 12:00 - 22:00',
        category: 'Western',
        status: 'Open',
    },
    {
        id: 'o10',
        title: 'Books n\' Bites',
        location: 'G/F, Jockey Club Academic Community Centre, BUR Campus',
        image: require('../assets/images/food/Books-n\'-Bites.png'),
        hours: 'Mon - Fri: 09:00 - 19:00',
        category: 'Snacks/Deli',
        status: 'Open',
    },
    {
        id: 'o11',
        title: 'Cafe@CVA Commons',
        location: 'G/F, CVA Building, BUR Campus',
        image: require('../assets/images/food/Cafe-CVA-Commons.png'),
        hours: 'Closed until further notice',
        category: 'Cafe/Tea',
        status: 'Closed',
    },
    {
        id: 'o12',
        title: 'Deli',
        location: 'Level 1, CVA Building, BUR Campus',
        image: require('../assets/images/food/Deli.png'),
        hours: 'Closed until further notice',
        category: 'Snacks/Deli',
        status: 'Closed',
    },
    {
        id: 'o13',
        title: 'BU Fiesta',
        location: 'G/F, Undergraduate Halls, BUR Campus',
        image: require('../assets/images/food/BU-Fiesta.png'),
        hours: 'Closed for renovation',
        category: 'Asian Cuisine',
        status: 'Closed',
    },
];
