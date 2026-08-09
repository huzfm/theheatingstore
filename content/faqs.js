/**
 * The homepage FAQ, and the ONLY source for it.
 *
 * app/page.js builds the FAQPage structured data from this same array, so
 * the markup and the visible accordion cannot say different things.
 *
 * They previously did, badly. The hand-written FAQPage in app/page.js listed
 * six questions that appeared nowhere on the page, told Google the company
 * served "Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata",
 * and named Heatmiser, Salus, EPH and Nuheat as partner brands. None of those
 * four is in app/lib/brandsData.js. Meanwhile the accordion below it held
 * these thirty-one questions, all about Kashmir.
 *
 * Add a question here and it is in the structured data automatically. That is
 * the point, so please do not reintroduce a second copy anywhere.
 */

export const FAQ_SECTIONS = [
	{
		section: 'Basics',
		faqs: [
			{ q: 'What is an Electric Hamam?', a: 'An electric hamam is a modern radiant underfloor heating system designed to heat both the floor and the entire room evenly. Heating mats or cables are installed beneath the floor surface inside a concrete screed layer, allowing warmth to radiate naturally upward. Unlike traditional wood-fired hamams, electric hamam systems require no wood, no smoke, no fuel storage, and no daily maintenance.' },
			{ q: 'How does electric underfloor heating work?', a: 'Electric underfloor heating uses specially designed heating mats or cables installed beneath the floor surface. The system gently warms the concrete layer, which then radiates heat evenly across the room. This creates comfortable, consistent warmth without the cold spots associated with traditional heating methods.' },
			{ q: 'Can electric hamam heat the whole room?', a: 'Yes. Our electric hamam systems are designed not only to warm the floor, but also to heat the entire room evenly. With proper coverage and insulation, the system works as a complete room heating solution for Kashmir winters.' },
			{ q: 'Is electric hamam suitable for Kashmir winters?', a: 'Yes. Our electric floor heating systems are specifically designed for Kashmir\'s cold climate, including snowfall and sub-zero temperatures. The heated concrete layer stores warmth for long periods, helping maintain comfort even during power cuts.' },
			{ q: 'What temperature can electric hamam reach?', a: 'Standard systems comfortably maintain room temperatures between 15°C and 18°C during winter, while floor temperatures can be adjusted significantly higher if required. Custom commercial systems can also be designed for specialised heating applications.' },
		],
	},
	{
		section: 'Cost & Electricity',
		faqs: [
			{ q: 'How much electricity does electric hamam consume?', a: 'Electric hamam systems typically use 150W to 200W heating systems depending on the room specification. Actual electricity usage depends on insulation, room size, outdoor temperature, and thermostat settings.' },
			{ q: 'Is electric hamam expensive to run?', a: 'No. Most customers find electric hamam systems surprisingly economical compared to traditional heating methods. A standard 10x10 room typically costs around ₹1500–₹1800 per month to operate depending on usage patterns and insulation.' },
			{ q: 'How much does electric hamam installation cost in Kashmir?', a: 'The installed cost of electric underfloor heating in Kashmir generally ranges between ₹180 and ₹350 per sq ft depending on the heating system, insulation specification, floor type, and thermostat selected.' },
			{ q: 'Does underfloor heating save energy compared to traditional heating?', a: 'Yes. Radiant floor heating distributes warmth evenly and retains heat inside the concrete layer, reducing energy wastage. Our adaptive variable wattage systems are also designed to improve energy efficiency further.' },
			{ q: 'Do electric hamam systems work during power cuts?', a: 'Yes. Because the heating system is embedded inside a concrete screed layer, the floor retains warmth for several hours even after electricity is disconnected. Depending on the system and insulation, rooms can remain comfortable for 8–10 hours.' },
		],
	},
	{
		section: 'Comparison',
		faqs: [
			{ q: 'Electric hamam vs traditional wood-fired hamam, which is better?', a: 'Electric hamam systems offer cleaner operation, easier control, lower maintenance, and more even heating compared to traditional wood-fired hamams. There is no wood storage, smoke, ash, kerosene, or chimney cleaning required.' },
			{ q: 'Why are families switching to electric hamam?', a: 'Many families now prefer electric hamam systems because they are cleaner, easier to use, and more comfortable. Heating can be controlled with a thermostat instead of manually burning wood every day.' },
			{ q: 'Does electric hamam produce smoke or dry air?', a: 'No. Electric radiant floor heating produces no smoke, fumes, or dry forced air. Unlike hot-and-cold AC systems, it heats the room gently and evenly without creating uncomfortable airflow.' },
			{ q: 'Is electric hamam healthier than forced-air heating?', a: 'Yes. Radiant floor heating does not circulate dust, allergens, or dry air around the room. Many customers prefer underfloor heating because it creates a more comfortable indoor environment during winter.' },
			{ q: 'Can carpets be used over electric hamam?', a: 'Yes. Traditional Kashmiri carpets can safely be used over electric hamam systems. Carpet remains one of the most commonly used floor finishes in Kashmir homes with underfloor heating.' },
		],
	},
	{
		section: 'Installation',
		faqs: [
			{ q: 'Can electric hamam be installed in existing homes?', a: 'Yes. Electric underfloor heating can be installed in both new construction projects and existing homes during renovation work.' },
			{ q: 'What floor finishes are compatible with electric underfloor heating?', a: 'Electric underfloor heating systems are compatible with carpet, marble, granite, tile, stone, and selected laminate flooring systems.' },
			{ q: 'Can laminate wood flooring be used with underfloor heating?', a: 'Yes. Selected laminate flooring systems can be used with electric underfloor heating. We generally recommend laminate flooring with suitable thermal specifications and thickness compatibility.' },
			{ q: 'How long does electric hamam installation take?', a: 'Most standard room installations are completed within approximately 5–6 hours, excluding floor drying and finishing time.' },
			{ q: 'What is the floor build-up required for electric hamam?', a: 'The system is installed inside a concrete screed structure consisting of insulation, screed, heating mat installation, and a second screed layer before the final floor finish is applied.' },
			{ q: 'Do you install heating mats or loose heating cables?', a: 'We primarily install pre-spaced heating mats for better consistency and efficiency. Loose heating cables are generally used only in smaller or irregular spaces such as bathrooms and washrooms.' },
		],
	},
	{
		section: 'Safety & Reliability',
		faqs: [
			{ q: 'Is electric hamam safe?', a: 'Yes. Our electric underfloor heating systems are designed with multiple safety protections and use certified heating components suitable for residential and commercial applications.' },
			{ q: 'Is underfloor heating safe in bathrooms and wet areas?', a: 'Yes. Electric underfloor heating systems can safely be installed in bathrooms and wet areas when the correct waterproofing and floor specification guidelines are followed.' },
			{ q: 'How long does electric hamam last?', a: 'Electric underfloor heating systems are designed to last for decades with minimal maintenance. Typical system lifespan is around 25 years or more depending on usage conditions.' },
			{ q: 'What warranty do you provide?', a: 'Selected systems include lifetime warranties along with manufacturer guarantees ranging from 10 to 25 years depending on the product selected.' },
			{ q: 'What happens if the heating cable gets damaged?', a: 'If accidental damage occurs during installation by our team, the heating system is replaced. Damage caused later by drilling or external construction work is not covered under warranty.' },
		],
	},
	{
		section: 'Advanced & Kashmir-Specific',
		faqs: [
			{ q: 'What is variable wattage electric hamam?', a: 'Variable wattage technology automatically adjusts heating performance based on operating conditions, helping improve comfort and energy efficiency. Our systems are among the few in India offering this advanced technology.' },
			{ q: 'Which underfloor heating system is best for Kashmir homes?', a: 'Systems designed specifically for Kashmir should focus on heat retention, radiant comfort, and efficient room heating during sub-zero winters. Proper coverage and screed design are equally important for performance.' },
			{ q: 'Can electric underfloor heating work in wooden Kashmiri homes?', a: 'Yes. Electric underfloor heating can be installed in many traditional Kashmiri homes, including selected wooden constructions, depending on the floor structure and insulation design.' },
			{ q: 'Can electric hamam systems be used in hotels and commercial spaces?', a: 'Yes. Electric floor heating systems are widely used in homes, hotels, villas, washrooms, spas, and commercial spaces requiring comfortable radiant heating.' },
			{ q: 'Can electric heating systems be customised for industrial applications?', a: 'Yes. Custom heating systems can be designed for specialised commercial and industrial applications including drying rooms, warehouses, and temperature-controlled processing areas.' },
		],
	},
];

/** Every question, flattened, in the order they appear on the page. */
export const ALL_FAQS = FAQ_SECTIONS.flatMap((s) => s.faqs);
