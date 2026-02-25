const extendedFoodDB = [
    // === GOTOVA JELA / TRADICIONALNO ===
    {
        name: "Sarma",
        keywords: ["sarma", "sarme", "sarmu"],
        kcalPer100g: 130,
        macrosPer100g: { carbs: 9, protein: 7, fat: 8 },
        standardUnits: { "kom": 150, "komad": 150, "sarme": 150, "porcija": 300 },
        note: "1 komad sarme (prosječan) ≈ 150g."
    },
    {
        name: "Punjena paprika",
        keywords: ["punjena paprika", "punjene paprike", "paprika punjena", "filovana paprika"],
        kcalPer100g: 110,
        macrosPer100g: { carbs: 8, protein: 6, fat: 6 },
        standardUnits: { "kom": 200, "komad": 200, "paprika": 200, "porcija": 400 },
        note: "1 srednje velika punjena paprika (s umakom) ≈ 200g."
    },
    {
        name: "Grah s kobasicom",
        keywords: ["grah s kobasicom", "pasulj sa kobasicom", "grah varivo", "vojnicki grah"],
        kcalPer100g: 145,
        macrosPer100g: { carbs: 12, protein: 8, fat: 7 },
        standardUnits: { "porcija": 400, "tanjur": 400, "zdjelica": 250 },
        note: "1 standardni duboki tanjur (porcija) variva ≈ 400g."
    },
    {
        name: "Gulaš (Goveđi / Svinjski)",
        keywords: ["gulas", "govedi gulas", "svinjski gulas", "cobanac"],
        kcalPer100g: 135,
        macrosPer100g: { carbs: 5, protein: 12, fat: 8 },
        standardUnits: { "porcija": 350, "tanjur": 350 },
        note: "Porcija u restoranu je obično oko 350g (bez priloga)."
    },
    {
        name: "Pašticada",
        keywords: ["pasticada", "dalmatinska pasticada"],
        kcalPer100g: 170,
        macrosPer100g: { carbs: 6, protein: 15, fat: 9 },
        standardUnits: { "porcija": 250, "komad": 250 },
        note: "Porcija mesa s gustom slatko-slanom umakom. Prilog (njoki) mjeri se odvojeno."
    },
    {
        name: "Pizza Margarita",
        keywords: ["pizza", "pica margarita", "margarita", "margherita", "snita pizze", "komad pizze"],
        kcalPer100g: 266,
        macrosPer100g: { carbs: 33, protein: 11, fat: 10 },
        standardUnits: { "komad": 120, "snita": 120, "cijela": 400, "velika": 500, "pizza": 400 },
        note: "1 standardna kriška/šnita ≈ 120g. Cijela normalna pizza ≈ 400g."
    },
    {
        name: "Pizza Miješana (Capricciosa)",
        keywords: ["pizza mijesana", "capricciosa", "kapricoza", "pica mijesana", "mjesana pizza"],
        kcalPer100g: 275,
        macrosPer100g: { carbs: 30, protein: 12, fat: 12 },
        standardUnits: { "komad": 130, "snita": 130, "cijela": 450, "velika": 550, "pizza": 450 },
        note: "1 kriška miješane pizze ≈ 130g. Cijela normalna pizza ≈ 450g."
    },
    {
        name: "Hamburger (Fast Food)",
        keywords: ["hamburger", "burger", "mcdonalds hamburger"],
        kcalPer100g: 295,
        macrosPer100g: { carbs: 24, protein: 17, fat: 14 },
        standardUnits: { "komad": 250, "burger": 250 },
        note: "Standardni pub/craft hamburger je oko 250g. (Za razliku od sitnih McDonald's burgera od 100g)."
    },
    {
        name: "Cheeseburger (Fast Food)",
        keywords: ["cheeseburger", "cisburger", "kisburger", "burger sa sirom"],
        kcalPer100g: 305,
        macrosPer100g: { carbs: 25, protein: 18, fat: 15 },
        standardUnits: { "komad": 280, "burger": 280 },
        note: "Prosječan craft cheeseburger."
    },
    {
        name: "Tortilja s piletinom",
        keywords: ["tortilja", "wrap", "tortilja piletina", "tortilja s piletinom"],
        kcalPer100g: 210,
        macrosPer100g: { carbs: 20, protein: 15, fat: 8 },
        standardUnits: { "komad": 300, "porcija": 300, "tortilja": 300 },
        note: "Standarna fast-food/restoranska punjena tortilja = cca 300g."
    },
    {
        name: "Hot Dog",
        keywords: ["hot dog", "hotdog", "hrenovka u pecivu"],
        kcalPer100g: 290,
        macrosPer100g: { carbs: 28, protein: 10, fat: 15 },
        standardUnits: { "komad": 150, "hot dog": 150 },
        note: "Standardni ulični hot dog s 1 hrenovkom i pecivom."
    },

    // === JUHE ===
    {
        name: "Goveđa juha (bistra)",
        keywords: ["goveda juha", "bistra juha", "mesna juha", "juha od mesa"],
        kcalPer100g: 15,
        macrosPer100g: { carbs: 1, protein: 1, fat: 1 },
        standardUnits: { "tanjur": 250, "porcija": 250 },
        note: "Odnosi se na samu tekućinu (bez previše rezanaca i mesa)."
    },
    {
        name: "Pileća juha (bistra)",
        keywords: ["pileca juha", "pilece juhe", "domaca pileca juha"],
        kcalPer100g: 20,
        macrosPer100g: { carbs: 2, protein: 1.5, fat: 1 },
        standardUnits: { "tanjur": 250, "porcija": 250 },
        note: "Standardni tanjur ≈ 250g tekućine s malo rezanaca."
    },
    {
        name: "Krem juha od gljiva / rajčice",
        keywords: ["krem juha", "juha od gljiva", "krem juha od rajcice", "paradajz juha"],
        kcalPer100g: 45,
        macrosPer100g: { carbs: 5, protein: 1.5, fat: 2 },
        standardUnits: { "tanjur": 250, "porcija": 250 },
        note: "Zbog vrhnja za kuhanje/zapřske, kaloričnija od bistre juhe."
    },

    // === DODATNO POVRĆE ===
    {
        name: "Paprika (Svježa)",
        keywords: ["paprika", "svjeza paprika", "crvena paprika", "zelena paprika", "zuta paprika"],
        kcalPer100g: 30,
        macrosPer100g: { carbs: 6, protein: 1, fat: 0.2 },
        standardUnits: { "komad": 150, "pola": 75 },
        note: "1 komad srednje veličine = 150g jestivog mesa."
    },
    {
        name: "Krastavac (Svježi)",
        keywords: ["krastavac", "krastavci", "salata od krastavaca"],
        kcalPer100g: 15,
        macrosPer100g: { carbs: 3.6, protein: 0.6, fat: 0.1 },
        standardUnits: { "komad": 250, "pola": 125, "porcija": 150 },
        note: "Veoma niskokalorično."
    },
    {
        name: "Luk crveni / bijeli (Češnjak)",
        keywords: ["luk", "kapula", "crveni luk", "cesnjak", "bijeli luk"],
        kcalPer100g: 40,
        macrosPer100g: { carbs: 9, protein: 1.1, fat: 0.1 },
        standardUnits: { "glavica": 100, "reznac": 5 },
        note: "Prosječna glavica crvenog luka ≈ 100g."
    },
    {
        name: "Mrkva (Svježa ili kuhana)",
        keywords: ["mrkva", "mrkve"],
        kcalPer100g: 41,
        macrosPer100g: { carbs: 10, protein: 0.9, fat: 0.2 },
        standardUnits: { "komad": 60, "kom": 60 },
        note: "1 srednja mrkva ≈ 60g."
    },
    {
        name: "Špinat / Blitva (Kuhano, bez vrhnja)",
        keywords: ["spinat", "blitva", "blitva na leso"],
        kcalPer100g: 23,
        macrosPer100g: { carbs: 3.6, protein: 2.9, fat: 0.4 },
        standardUnits: { "porcija": 150, "zlica": 30 },
        note: "Odnosi se na obično kuhano. Sa krumpirom računaj krumpir zasebno."
    },
    {
        name: "Kupus salata (bez ulja)",
        keywords: ["salata od zelja", "kupus salata"],
        kcalPer100g: 25,
        macrosPer100g: { carbs: 6, protein: 1.3, fat: 0.1 },
        standardUnits: { "zdjelica": 150, "porcija": 150 },
        note: "Dodano ulje povećava kalorije (1 žlica = +130 Kcal)."
    },

    // === DODATNO VOĆE ===
    {
        name: "Naranča",
        keywords: ["naranca", "narance"],
        kcalPer100g: 47,
        macrosPer100g: { carbs: 12, protein: 0.9, fat: 0.1 },
        standardUnits: { "komad": 130, "kom": 130 },
        note: "1 normalna naranča (jestivi dio) = 130g."
    },
    {
        name: "Mandarina",
        keywords: ["mandarina", "mandarine"],
        kcalPer100g: 53,
        macrosPer100g: { carbs: 13, protein: 0.8, fat: 0.3 },
        standardUnits: { "komad": 80, "kom": 80 },
        note: "Mandarina je teška oko 80g."
    },
    {
        name: "Breskva / Nektarina",
        keywords: ["breskva", "nektarina", "breskve"],
        kcalPer100g: 39,
        macrosPer100g: { carbs: 10, protein: 0.9, fat: 0.3 },
        standardUnits: { "komad": 130, "kom": 130 },
        note: "Srednja breskva = 130g jestivog dijela."
    },
    {
        name: "Jagode",
        keywords: ["jagoda", "jagode"],
        kcalPer100g: 32,
        macrosPer100g: { carbs: 8, protein: 0.7, fat: 0.3 },
        standardUnits: { "salica": 150, "porcija": 150, "komad": 15 },
        note: "Mjereno na manju zdjelicu (150g)."
    },

    // === ORAŠASTI PLODOVI I SJEMENKE ===
    {
        name: "Orasi (jezgra)",
        keywords: ["orasi", "orah", "jezgra oraha"],
        kcalPer100g: 654,
        macrosPer100g: { carbs: 14, protein: 15, fat: 65 },
        standardUnits: { "saka": 30, "zlica": 15 },
        note: "Jako kalorično - zdrave masti. 1 obična šaka = cca 30g."
    },
    {
        name: "Bademi",
        keywords: ["badem", "bademi", "bajame"],
        kcalPer100g: 579,
        macrosPer100g: { carbs: 22, protein: 21, fat: 50 },
        standardUnits: { "saka": 30, "zlica": 15 },
        note: "1 šaka = cca 30g."
    },
    {
        name: "Kikiriki (prženi, slani)",
        keywords: ["kikiriki", "slani kikiriki"],
        kcalPer100g: 585,
        macrosPer100g: { carbs: 22, protein: 24, fat: 49 },
        standardUnits: { "saka": 30, "paketic": 100 },
        note: "Šaka je 30g. Mali paketić u kafiću = 50g."
    },
    {
        name: "Lješnjaci",
        keywords: ["ljesnjak", "ljesnjaci"],
        kcalPer100g: 628,
        macrosPer100g: { carbs: 17, protein: 15, fat: 61 },
        standardUnits: { "saka": 30, "zlica": 15 },
        note: "1 šaka = cca 30g."
    },

    // === RIBA I MORSKI PLODOVI ===
    {
        name: "Tuna (iz konzerve, ocijeđena)",
        keywords: ["tuna", "tuna konzerva", "tunjevina", "konzerva tune"],
        kcalPer100g: 110,
        macrosPer100g: { carbs: 0, protein: 25, fat: 1 },
        standardUnits: { "konzerva": 130, "mala konzerva": 80 },
        note: "Gleda se čista ocijeđena masa manje konzerve Rio Mare i sl. (salamura)."
    },
    {
        name: "Lignje (Pržene / Kolutići)",
        keywords: ["lignje", "przene lignje", "kolutici lignji", "frigane lignje"],
        kcalPer100g: 220,
        macrosPer100g: { carbs: 12, protein: 16, fat: 11 },
        standardUnits: { "porcija": 250 },
        note: "Standardna ugostiteljska porcija je oko 250g-300g (s puno ulja)."
    },
    {
        name: "Lignje (na žaru)",
        keywords: ["lignje na zaru", "lignje na gradele"],
        kcalPer100g: 140,
        macrosPer100g: { carbs: 3, protein: 21, fat: 4 },
        standardUnits: { "porcija": 250 },
        note: "Puno zdravija verzija, manje lipida od friganih."
    },
    {
        name: "Oslić (Panirani / Prženi)",
        keywords: ["oslic", "pohani oslic", "oslic fileti"],
        kcalPer100g: 190,
        macrosPer100g: { carbs: 10, protein: 14, fat: 10 },
        standardUnits: { "komad": 100, "filet": 100, "porcija": 250 },
        note: "1 prženi filet oslića iznosi cca 100g."
    },
    {
        name: "Gof / Brancin / Orada (Pečena bijela riba)",
        keywords: ["orada", "brancin", "gof", "riba s gradela", "riba na zaru"],
        kcalPer100g: 135,
        macrosPer100g: { carbs: 0, protein: 23, fat: 5 },
        standardUnits: { "komad": 300, "riba": 300, "porcija": 300 },
        note: "Računato samo jestivo meso (iz jedne ribe porcijaša dobije se oko 200-250g krtog mesa)."
    },

    // === DODACI, NAMAZI I UMAZI ===
    {
        name: "Ketchup (Kečap)",
        keywords: ["ketchup", "kecap"],
        kcalPer100g: 110,
        macrosPer100g: { carbs: 26, protein: 1, fat: 0 },
        standardUnits: { "zlica": 15, "porcija": 30 },
        note: "Standardna jušna žlica ketchupa = 15g (uglavnom šećer)."
    },
    {
        name: "Majoneza",
        keywords: ["majoneza", "majoneze"],
        kcalPer100g: 680,
        macrosPer100g: { carbs: 1, protein: 1, fat: 75 },
        standardUnits: { "zlica": 15, "porcija": 30 },
        note: "Izrazito kalorično! 1 velika žlica donosi preko 100 Kcal."
    },
    {
        name: "Pašteta (Jetrena)",
        keywords: ["pasteta", "jetrena pasteta", "kokosja pasteta", "gavrilovic pasteta"],
        kcalPer100g: 315,
        macrosPer100g: { carbs: 2.5, protein: 10, fat: 30 },
        standardUnits: { "snita": 20, "zlica": 20, "konzerva": 50, "velika konzerva": 100 },
        note: "Standardna mala doza / mazanje jedne šnite kruha = 20g."
    },
    {
        name: "Mliječni namaz (ABC, Philadelphia)",
        keywords: ["abc sir", "mlijecni namaz", "sirni namaz", "philadelphia"],
        kcalPer100g: 235,
        macrosPer100g: { carbs: 3.5, protein: 6, fat: 23 },
        standardUnits: { "snita": 20, "zlica": 20, "namaz": 20 },
        note: "Klasično mazanje jedne šnite kruha iznosi cca 20-25g."
    },
    {
        name: "Ajvar",
        keywords: ["ajvar", "ajvara"],
        kcalPer100g: 95,
        macrosPer100g: { carbs: 10, protein: 2, fat: 5 },
        standardUnits: { "zlica": 20, "porcija": 40 },
        note: "1 jušna žlica punjena ajvarom teži cca 20g."
    },
    {
        name: "Marmelada / Džem / Pekmez",
        keywords: ["marmelada", "dzem", "pekmez", "marmeladu"],
        kcalPer100g: 278,
        macrosPer100g: { carbs: 68, protein: 0.5, fat: 0.1 },
        standardUnits: { "zlica": 20, "zlicica": 10 },
        note: "1 jušna žlica marmelade (puna šećera) = 20g."
    },
    {
        name: "Nutella / Eurokrem",
        keywords: ["nutella", "nutela", "eurokrem", "linolada"],
        kcalPer100g: 539,
        macrosPer100g: { carbs: 57, protein: 6.3, fat: 30.9 },
        standardUnits: { "zlica": 25, "zlicica": 10 },
        note: "1 prepuna žlica Nutelle = preko 130 Kcal."
    },

    // === SLATKIŠI ===
    {
        name: "Palačinka (prazna)",
        keywords: ["palacinka", "palacinke", "palacinku"],
        kcalPer100g: 227,
        macrosPer100g: { carbs: 28, protein: 6, fat: 10 },
        standardUnits: { "kom": 60, "komad": 60 },
        note: "Težina ovisi o punjenju, no samo 1 ispečeno tijesto teži oko 60g."
    },
    {
        name: "Palačinka s čokoladom / Nutellom",
        keywords: ["palacinka s nutellom", "palacinka s cokoladom", "cokoladna palacinka"],
        kcalPer100g: 310,
        macrosPer100g: { carbs: 39, protein: 6, fat: 14 },
        standardUnits: { "kom": 100, "komad": 100 },
        note: "60g tijesto + 40g namaza = velika bomba od cca 310 Kcal po jednom komadu!"
    },
    {
        name: "Njoki (kuhani)",
        keywords: ["njoki", "kuhani njoki", "porcija njoka"],
        kcalPer100g: 133,
        macrosPer100g: { carbs: 30, protein: 3.5, fat: 0.5 },
        standardUnits: { "porcija": 250 },
        note: "Odnosi se na kuhane njoke. Standardni restoran daje 200-250g po porciji."
    },
    {
        name: "Keksi Domaćica",
        keywords: ["domacica", "keksi domacica"],
        kcalPer100g: 483,
        macrosPer100g: { carbs: 58, protein: 6.4, fat: 24 },
        standardUnits: { "keks": 12, "komad": 12, "kom": 12, "porcija": 50 },
        note: "1 keks teži oko 12g."
    },
    {
        name: "Keksi Plazma",
        keywords: ["plazma keksi", "slatki keksi", "petit beurre"],
        kcalPer100g: 440,
        macrosPer100g: { carbs: 70, protein: 11.9, fat: 12 },
        standardUnits: { "keks": 8, "komad": 8, "kom": 8, "porcija": 50 },
        note: "Vrlo suhi, lagani ali kalorični. 1 Plazma = cca 8g."
    },
    {
        name: "Čips (Slani) / Smoki",
        keywords: ["cips", "smoki", "slani cips", "vrecica cipsa", "flips"],
        kcalPer100g: 536,
        macrosPer100g: { carbs: 53, protein: 6, fat: 35 },
        standardUnits: { "vrecica": 150, "mala vrecica": 50, "saka": 30 },
        note: "Izrazito puno masti. Velika vrećica čipsa je obično 150g."
    }
];

// Ovdje integriram proširenu listu u već postojeći foodDB iz prve iteracije.
extendedFoodDB.forEach(item => {
    // Ako već nije u bazi pod istim imenom (da se ne duplira ako dodamo dvaput)
    if (!localFoodDB.some(f => f.name === item.name)) {
        localFoodDB.push(item);
    }
});
