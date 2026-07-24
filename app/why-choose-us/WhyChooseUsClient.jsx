'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import MarqueeBar from '../components/MarqueeBar';
import OurProcess from '../components/OurProcess';
import OurBrands from '../components/OurBrands';

const Icon = {
	Customers: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
			<circle cx='9' cy='7' r='4' />
			<path d='M23 21v-2a4 4 0 0 0-3-3.87' />
			<path d='M16 3.13a4 4 0 0 1 0 7.75' />
		</svg>
	),
	Shield: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Systems: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<rect x='2' y='3' width='20' height='14' rx='2' />
			<path d='M8 21h8M12 17v4' />
			<path d='M7 8h.01M11 8h6' />
			<path d='M7 12h.01M11 12h6' />
		</svg>
	),
	Globe: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<circle cx='12' cy='12' r='10' />
			<line x1='2' y1='12' x2='22' y2='12' />
			<path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
		</svg>
	),
	Wrench: ({ size = 18, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
		</svg>
	),
	Refresh: ({ size = 18, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<polyline points='23 4 23 10 17 10' />
			<path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
		</svg>
	),
	ClipboardCheck: ({ size = 18, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' />
			<rect x='9' y='3' width='6' height='4' rx='1' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Ruler: ({ size = 18, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M3 21h18' />
			<path d='M3 7v1' />
			<path d='M7 3v4' />
			<path d='M11 7v1' />
			<path d='M15 3v4' />
			<path d='M19 7v1' />
			<path d='M3 3h18v4H3z' />
		</svg>
	),
	MessageCircle: ({ size = 26, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.4'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
		</svg>
	),
	Layout: ({ size = 26, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.4'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<rect x='3' y='3' width='18' height='18' rx='2' />
			<line x1='3' y1='9' x2='21' y2='9' />
			<line x1='9' y1='21' x2='9' y2='9' />
		</svg>
	),
	Package: ({ size = 26, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.4'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<line x1='16.5' y1='9.4' x2='7.5' y2='4.21' />
			<path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
			<polyline points='3.27 6.96 12 12.01 20.73 6.96' />
			<line x1='12' y1='22.08' x2='12' y2='12' />
		</svg>
	),
	Tool: ({ size = 26, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.4'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
		</svg>
	),
	Award: ({ size = 26, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.4'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<circle cx='12' cy='8' r='6' />
			<path d='M15.477 12.89L17 22l-5-3-5 3 1.523-9.11' />
		</svg>
	),
	Flame: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' />
		</svg>
	),
	Thermometer: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z' />
		</svg>
	),
	Droplets: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z' />
			<path d='M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97' />
		</svg>
	),
	Cpu: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<rect x='4' y='4' width='16' height='16' rx='2' />
			<rect x='9' y='9' width='6' height='6' />
			<path d='M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3' />
		</svg>
	),
	Zap: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
		</svg>
	),
	Home: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
			<polyline points='9 22 9 12 15 12 15 22' />
		</svg>
	),
	Layers: ({ size = 14, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<polygon points='12 2 2 7 12 12 22 7 12 2' />
			<polyline points='2 17 12 22 22 17' />
			<polyline points='2 12 12 17 22 12' />
		</svg>
	),
	BoxOpen: ({ size = 14, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<polyline points='21 8 21 21 3 21 3 8' />
			<rect x='1' y='3' width='22' height='5' />
			<line x1='10' y1='12' x2='14' y2='12' />
		</svg>
	),
	HardHat: ({ size = 14, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z' />
			<path d='M10 10V5a2 2 0 1 1 4 0v5' />
			<path d='M4 15V9a8 8 0 0 1 16 0v6' />
		</svg>
	),
	BadgeCheck: ({ size = 14, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Chat: ({ size = 14, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
		</svg>
	),
	RotateCw: ({ size = 14, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.8'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<polyline points='23 4 23 10 17 10' />
			<path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
		</svg>
	),
	ShieldLarge: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	GlobeLarge: ({ size = 22, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<circle cx='12' cy='12' r='10' />
			<line x1='2' y1='12' x2='22' y2='12' />
			<path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
		</svg>
	),
	Trophy: ({ size = 16, color = 'currentColor' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6' />
			<path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18' />
			<path d='M4 22h16' />
			<path d='M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' />
			<path d='M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' />
			<path d='M18 2H6v7a6 6 0 0 0 12 0V2z' />
		</svg>
	),
	Star: ({ size = 13, color = '#F5B97A' }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill={color}
			stroke={color}
			strokeWidth='0'>
			<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
		</svg>
	),
	Quote: ({ size = 36, color = 'currentColor', opacity = 0.15 }) => (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill={color}
			stroke='none'
			opacity={opacity}>
			<path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
		</svg>
	),
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
	{
		display: '300K+',
		label: 'Happy Customers',
		sub: 'Across India & 9 countries',
		IconComp: Icon.Customers,
		color: '#E8933A',
		pct: 92,
		bullets: ['Residential & commercial projects', 'Verified 5 star reviews', '99% satisfaction rate'],
		tag: 'Most Trusted',
	},
	{
		display: '10 - 25+',
		label: 'Year Warranty',
		sub: 'Industry-leading coverage',
		IconComp: Icon.Shield,
		color: '#4FA3D1',
		pct: 100,
		bullets: ['10 to 25 years warranty', 'No hassle claims process', 'Parts & labour fully covered'],
		tag: 'Industry Best',
	},
	{
		display: '2M+',
		label: 'Systems Installed',
		sub: 'Globally since 2011',
		IconComp: Icon.Systems,
		color: '#B86B45',
		pct: 78,
		bullets: ['500,000+ installations in India', '0.01% fault rate across all systems', 'Compatible with every floor type'],
		tag: 'Market Leader',
	},
	{
		display: '9',
		label: 'Countries',
		sub: 'Internationally trusted',
		IconComp: Icon.Globe,
		color: '#6BAE7F',
		pct: 56,
		bullets: ['UK · Sweden · UAE · France', 'Finland · Netherlands · Turkey', 'Bhutan · India — and growing'],
		tag: 'Global Reach',
	},
];

const COUNTRIES = [
	{ name: 'United Kingdom', code: 'gb' },
	{ name: 'Sweden', code: 'se' },
	{ name: 'Netherlands', code: 'nl' },
	{ name: 'Finland', code: 'fi' },
	{ name: 'France', code: 'fr' },
	{ name: 'Turkey', code: 'tr' },
	{ name: 'UAE', code: 'ae' },
	{ name: 'Bhutan', code: 'bt' },
	{ name: 'India', code: 'in' },
];


const PROCESS = [
	{
		num: '01',
		IconComp: Icon.MessageCircle,
		title: 'Free Consultation',
		desc: 'Our experts assess your space, floor type, and usage to craft the perfect heating solution for your exact project.',
		img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
	},
	{
		num: '02',
		IconComp: Icon.Layout,
		title: 'Price Expert Consultation',
		desc: 'Found the same underfloor heating product cheaper elsewhere? We will aim to match the price wherever possible. Simply send us the competitor’s quote or website link before ordering, and our team will review it promptly.',
		img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
	},
	{
		num: '03',
		IconComp: Icon.Package,
		title: 'Excellent Service Support',
		desc: 'Our team is here to guide you every step of the way. From choosing the right system to installation advice and aftercare. Friendly, knowledgeable, and always just a call or click away.',
		img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
	},
	{
		num: '04',
		IconComp: Icon.Tool,
		title: 'Price Match Promise',
		desc: 'Our team is here to guide you every step of the way. From choosing the right system to installation advice and aftercare. Friendly, knowledgeable, and always just a call or click away.',
		img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
	},
	{
		num: '05',
		IconComp: Icon.Award,
		title: 'Lifetime Warranty',
		desc: 'We stand by the quality of our underfloor heating systems. That’s why many of our products come with lifetime warranties, giving you long-term peace of mind.',
		img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
	},
];

const TESTIMONIALS = [
	{
		initials: 'AA',
		name: 'Asif Ali',
		role: 'Principal Architect, Ali Associates, Srinagar',
		tag: 'Verified Purchase',
		text: 'We have specified The Heating Store across six luxury residential and commercial projects. The installation quality is immaculate — zero callbacks, zero defects. The 0.01% fault rate they advertise is absolutely real. Nothing else comes close.',
	},
	{
		initials: 'KS',
		name: 'Kamran Siddiq',
		role: 'Senior Project Manager, Siddiq Builders, Jammu',
		tag: 'Trade Account',
		text: 'The design consultation was outstanding. Custom heating zones mapped across a 5,000 sq ft penthouse — flawless installation from start to finish. Our clients were absolutely delighted with the result.',
	},
	{
		initials: 'SF',
		name: 'Syed Faizan',
		role: 'Head of Development, Faizan Developments, Kashmir',
		tag: 'Commercial Project',
		text: 'Deployed across a 60-unit luxury residential complex. Every system performed perfectly from day one. The 25-year warranty gives our homebuyers genuine confidence — it is a real differentiator in the market.',
	},
];

const AVATARS = [
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
];

const EASE = [0.16, 1, 0.3, 1];
const CARD_GAP = 24;

// ─────────────────────────────────────────────────────────────────────────────
// SMALL REUSABLES
// ─────────────────────────────────────────────────────────────────────────────

function Flag({ code, name }) {
	return (
		<img
			src={`https://flagcdn.com/w40/${code}.png`}
			srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
			width={20}
			height={15}
			alt={name}
			style={{
				borderRadius: 2,
				objectFit: 'cover',
				flexShrink: 0,
				minWidth: 20,
			}}
		/>
	);
}

function Badge({ children }) {
	return (
		<div
			style={{
				position: 'relative',
				display: 'inline-flex',
				marginBottom: 12,
			}}>
			<span
				aria-hidden
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 999,
					pointerEvents: 'none',
					background:
						'linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08)',
					opacity: 0.7,
				}}
			/>
			<p
				style={{
					position: 'relative',
					display: 'inline-flex',
					alignItems: 'center',
					gap: 8,
					whiteSpace: 'nowrap',
					padding: '8px 28px',
					fontFamily: "var(--font-body)",
					fontSize: 10,
					fontWeight: 500,
					textTransform: 'uppercase',
					letterSpacing: '0.45em',
					color: '#4FA3D1',
					borderRadius: 999,
					background: 'rgba(255,255,255,0.22)',
					backdropFilter: 'blur(16px)',
					WebkitBackdropFilter: 'blur(16px)',
					border: '1px solid rgba(255,255,255,0.3)',
					boxShadow:
						'inset 0 1px 0 rgba(255,255,255,0.45), 0 14px 40px rgba(15,23,42,0.22)',
					margin: 0,
				}}>
				<span
					style={{
						width: 6,
						height: 6,
						borderRadius: '50%',
						background: '#B86B45',
						flexShrink: 0,
						animation: 'wcu-blink 2s ease-in-out infinite',
					}}
				/>
				{children}
			</p>
		</div>
	);
}

function SectionHeading({
	badge,
	title,
	accent,
	sub,
	center = false,
}) {
	return (
		<div
			style={{
				textAlign: center ? 'center' : 'left',
				maxWidth: center ? 580 : 'none',
				margin: center ? '0 auto' : 0,
			}}>
			<Badge>{badge}</Badge>
			<h1
				style={{
					fontFamily: "var(--font-heading)",
					fontSize: 'clamp(28px, 4vw, 52px)',
					fontWeight: 600,
					lineHeight: 1.1,
					letterSpacing: '-0.01em',
					color: '#3C2A25',
					margin: 0,
				}}>
				{title}
				{accent && (
					<span
						style={{
							display: 'inline',
							fontWeight: 300,
							color: '#B86B45',
						}}>
						{accent}
					</span>
				)}
			</h1>
			{sub && (
				<p
					style={{
						marginTop: 16,
						fontFamily: "var(--font-body)",
						fontSize: 'clamp(14px, 2vw, 17px)',
						lineHeight: 1.75,
						color: '#3C2B27',
						fontWeight: 400,
						maxWidth: center ? 520 : 540,
						margin: center ? '16px auto 0' : '16px 0 0',
					}}>
					{sub}
				</p>
			)}
		</div>
	);
}

function Counter({ display }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount: 0.5 });
	const [val, setVal] = useState('—');
	useEffect(() => {
		if (!seen) return;
		const t = setTimeout(() => setVal(display), 180);
		return () => clearTimeout(t);
	}, [seen, display]);
	return <span ref={ref}>{val}</span>;
}

function GlassCard({ children, style = {}, hover = true }) {
	return (
		<div
			className={hover ? 'wcu-hover' : ''}
			style={{
				background: 'rgba(255,255,255,0.68)',
				backdropFilter: 'blur(28px)',
				WebkitBackdropFilter: 'blur(28px)',
				border: '1px solid rgba(255,255,255,0.5)',
				borderRadius: 24,
				boxShadow:
					'0 8px 32px rgba(60,42,37,0.07), 0 2px 8px rgba(60,42,37,0.04)',
				...style,
			}}>
			{children}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function WhyChooseUsClient() {
	const heroRef = useRef(null);
	const reliRef = useRef(null);
	const processRef = useRef(null);
	const testiRef = useRef(null);
	const ctaRef = useRef(null);
	const carouselRef = useRef(null);
	const [cardWidth, setCardWidth] = useState(700);

	const heroIn = useInView(heroRef, { once: true, amount: 0.05 });
	const reliIn = useInView(reliRef, { once: true, amount: 0.1 });
	const processIn = useInView(processRef, {
		once: true,
		amount: 0.05,
	});
	const testiIn = useInView(testiRef, { once: true, amount: 0.05 });
	const ctaIn = useInView(ctaRef, { once: true, amount: 0.1 });

	const [activeStep, setActiveStep] = useState(0);

	useEffect(() => {
		const update = () => {
			if (carouselRef.current) {
				const w = carouselRef.current.offsetWidth;
				const pct = w < 600 ? 0.82 : 0.7;
				setCardWidth(Math.round(w * pct));
			}
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const trackShift = `calc(50% - ${activeStep * (cardWidth + CARD_GAP) + cardWidth / 2}px)`;

	return (
		<>
			<style>{`
        @keyframes wcu-blink { 0%,100%{opacity:1} 50%{opacity:.18} }
        @keyframes wcu-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

        .wcu-noise::before { content:''; position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.018; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .wcu-grid::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:0; background-image: repeating-linear-gradient(0deg,rgba(60,42,37,.03) 0,transparent 1px,transparent 80px,rgba(60,42,37,.03) 80px), repeating-linear-gradient(90deg,rgba(60,42,37,.03) 0,transparent 1px,transparent 80px,rgba(60,42,37,.03) 80px); }

        .wcu-hover { transition: transform .38s cubic-bezier(0.16,1,0.3,1), box-shadow .38s ease; }
        .wcu-hover:hover { transform: translateY(-6px) !important; box-shadow: 0 36px 90px rgba(60,42,37,0.13), 0 8px 20px rgba(60,42,37,0.06) !important; }

        .wcu-pill { transition: all .22s ease; cursor: default; }
        .wcu-pill:hover { background: rgba(184,107,69,0.12) !important; border-color: rgba(184,107,69,0.4) !important; transform: translateY(-2px); }

        .wcu-brand { transition: all .2s ease; cursor: pointer; }
        .wcu-brand:hover { background: rgba(245,185,122,0.28) !important; transform: scale(.97); }
        .wcu-brand:hover .wcu-brand-icon { background: rgba(193,122,80,0.15) !important; }

        .wcu-testi { transition: transform .3s ease, box-shadow .3s ease; }
        .wcu-testi:hover { transform: translateY(-6px); box-shadow: 0 36px 90px rgba(60,42,37,.13) !important; }

        .wcu-cta-btn { transition: transform .3s ease, box-shadow .3s ease; cursor: pointer; }
        .wcu-cta-btn:hover { transform: scale(1.05) !important; box-shadow: 0 22px 70px rgba(184,107,69,0.45) !important; }
        .wcu-link-btn { transition: background .2s ease; cursor: pointer; }
        .wcu-link-btn:hover { background: rgba(255,232,207,0.9) !important; }

        .wcu-arrow { transition: background .22s ease, box-shadow .22s ease, transform .22s ease; }
        .wcu-arrow:not(:disabled):hover { background: white !important; box-shadow: 0 10px 36px rgba(60,42,37,0.2) !important; transform: translateY(-50%) scale(1.1) !important; }
        .wcu-arrow:not(:disabled):active { transform: translateY(-50%) scale(0.96) !important; }

        .wcu-bento { display: grid; grid-template-columns: 1.15fr 1fr 1fr; grid-template-rows: auto auto; gap: 16px; }
        .wcu-bento-hero { grid-column: 1; grid-row: 1 / 3; height: 580px; }
        .wcu-bento-stat-0 { grid-column: 2; grid-row: 1; }
        .wcu-bento-stat-1 { grid-column: 3; grid-row: 1; }
        .wcu-bento-stat-2 { grid-column: 2; grid-row: 2; }
        .wcu-bento-stat-3 { grid-column: 3; grid-row: 2; }

        .wcu-reli-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .wcu-brands-grid { display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start; }
        .wcu-brand-portfolio-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(184,107,69,0.08); }
        .wcu-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .wcu-cta-inner { padding: 48px 52px; display: grid; grid-template-columns: 1fr 1px 1fr 1px auto; gap: 44px; align-items: center; }
        .wcu-cta-divider { width: 1px; height: 80px; background: rgba(184,107,69,0.18); align-self: center; }

        .wcu-section-pad { max-width: 1320px; margin: 0 auto; padding: 88px 40px 36px; }
        .wcu-inner-pad   { max-width: 1320px; margin: 0 auto; padding: 0 40px 36px; }
        .wcu-process-pad { max-width: 100%; padding: 56px 0 64px; }
        .wcu-process-head { max-width: 1320px; margin: 0 auto; padding: 0 40px 52px; }
        .wcu-brands-pad  { max-width: 1320px; margin: 0 auto; padding: 0 40px 56px; }
        .wcu-testi-pad   { max-width: 1320px; margin: 0 auto; padding: 0 40px 56px; }
        .wcu-cta-pad     { max-width: 1320px; margin: 0 auto; padding: 0 40px 88px; }

        @media (max-width: 1024px) {
          .wcu-bento { grid-template-columns: 1fr 1fr; }
          .wcu-bento-hero { grid-column: 1 / 3; grid-row: 1; height: 360px; }
          .wcu-bento-stat-0 { grid-column: 1 !important; grid-row: 2 !important; }
          .wcu-bento-stat-1 { grid-column: 2 !important; grid-row: 2 !important; }
          .wcu-bento-stat-2 { grid-column: 1 !important; grid-row: 3 !important; }
          .wcu-bento-stat-3 { grid-column: 2 !important; grid-row: 3 !important; }
          .wcu-brands-grid { grid-template-columns: 1fr; }
          .wcu-cta-inner { grid-template-columns: 1fr; gap: 28px; padding: 36px; }
          .wcu-cta-divider { display: none; }
        }
        @media (max-width: 768px) {
          .wcu-section-pad { padding: 80px 20px 28px; }
          .wcu-inner-pad { padding: 0 20px 28px; }
          .wcu-process-head { padding: 0 20px 40px; }
          .wcu-brands-pad { padding: 0 20px 40px; }
          .wcu-testi-pad { padding: 0 20px 40px; }
          .wcu-cta-pad { padding: 0 20px 56px; }
          .wcu-bento { grid-template-columns: 1fr 1fr; gap: 10px; }
          .wcu-bento-hero { grid-column: 1 / 3; grid-row: 1; height: 220px; border-radius: 20px !important; }
          .wcu-bento-stat-0 { grid-column: 1 !important; grid-row: 2 !important; }
          .wcu-bento-stat-1 { grid-column: 2 !important; grid-row: 2 !important; }
          .wcu-bento-stat-2 { grid-column: 1 !important; grid-row: 3 !important; }
          .wcu-bento-stat-3 { grid-column: 2 !important; grid-row: 3 !important; }
          .wcu-stat-card { padding: 14px !important; }
          .wcu-stat-counter { font-size: clamp(22px, 6vw, 28px) !important; }
          .wcu-reli-grid { grid-template-columns: 1fr; }
          .wcu-brands-grid { grid-template-columns: 1fr; }
          .wcu-brand-portfolio-grid { grid-template-columns: repeat(2,1fr); }
          .wcu-testi-grid { grid-template-columns: 1fr; }
          .wcu-cta-inner { grid-template-columns: 1fr; gap: 24px; padding: 32px 24px; }
          .wcu-cta-btns { align-items: stretch !important; }
          .wcu-social-proof { flex-direction: row !important; justify-content: flex-start !important; align-items: center !important; gap: 14px !important; }
          .wcu-hero-award { top: 14px !important; left: 14px !important; }
          .wcu-hero-bottom { padding: 0 18px 18px !important; }
          .wcu-hero-h3 { font-size: 20px !important; }
        }
        @media (max-width: 400px) {
          .wcu-brand-portfolio-grid { grid-template-columns: 1fr; }
          .wcu-bento { grid-template-columns: 1fr; }
          .wcu-bento-hero { grid-column: 1; height: 200px; }
          .wcu-bento-stat-0, .wcu-bento-stat-1, .wcu-bento-stat-2, .wcu-bento-stat-3 { grid-column: 1 !important; grid-row: auto !important; }
          .wcu-cta-inner { padding: 24px 18px; }
        }
      `}</style>

			<section
				className='wcu-noise wcu-grid'
				style={{
					position: 'relative',
					zIndex: 1,
					backgroundImage:
						'linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 35%,#FFE0C2 70%,#F5B97A 100%)',
				}}>
				<motion.div
					aria-hidden
					animate={{ opacity: [0.25, 0.4, 0.25] }}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					style={{
						position: 'absolute',
						inset: 0,
						pointerEvents: 'none',
						zIndex: 0,
						background:
							'radial-gradient(60% 35% at 50% 0%,rgba(245,185,122,0.35),transparent 70%)',
					}}
				/>

				{/* ═══ §1 HERO ═══ */}
				<div
					ref={heroRef}
					className='wcu-section-pad relative'
					style={{ zIndex: 2 }}>
					<motion.div
						initial={{ opacity: 0, y: 26 }}
						animate={heroIn ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 1, ease: EASE }}
						style={{ maxWidth: 700, marginBottom: 48 }}>
						<SectionHeading
							badge='Why Choose Us'
							title="Why Homeowners, Architects "
							accent='& Builders Choose The Heating Store'
							sub="Awarded Jammu & Kashmir's most trusted underfloor heating provider for five consecutive years. 500,000+ successful installations, 99% client satisfaction rate, and an industry-leading lifetime warranty on every system we install."
						/>
						<motion.div
							className='wcu-social-proof'
							initial={{ opacity: 0, y: 14 }}
							animate={heroIn ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 18,
								marginTop: 32,
							}}>
							<div style={{ display: 'flex', flexShrink: 0 }}>
								{AVATARS.map((src, i) => (
									<div
										key={i}
										style={{
											width: 38,
											height: 38,
											borderRadius: '50%',
											border: '2.5px solid white',
											marginLeft: i === 0 ? 0 : -10,
											overflow: 'hidden',
											boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
										}}>
										<img
											src={src}
											alt='Satisfied customer testimonial avatar'
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
										/>
									</div>
								))}
								<div
									style={{
										width: 38,
										height: 38,
										borderRadius: '50%',
										border: '2.5px solid white',
										marginLeft: -10,
										background:
											'linear-gradient(135deg,#F5B97A,#E8933A)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 13,
										fontWeight: 700,
										color: 'white',
									}}>
									+
								</div>
							</div>
							<div>
								<div
									style={{
										display: 'flex',
										gap: 3,
										marginBottom: 4,
									}}>
									{[1, 2, 3, 4, 5].map((n) => (
										<Icon.Star key={n} />
									))}
								</div>
								<p
									style={{
										fontFamily: "var(--font-body)",
										fontSize: 13,
										color: '#3C2B27',
									}}>
									<strong style={{ color: '#3C2A25' }}>
										300,000+ customers
									</strong>{' '}
									trust us across India &amp; beyond
								</p>
							</div>
						</motion.div>
					</motion.div>

					{/* bento */}
					<div className='wcu-bento'>
						<motion.div
							initial={{ opacity: 0, scale: 0.97 }}
							animate={heroIn ? { opacity: 1, scale: 1 } : {}}
							transition={{ duration: 1, ease: EASE }}
							className='wcu-bento-hero wcu-hover'
							style={{
								borderRadius: 28,
								overflow: 'hidden',
								position: 'relative',
								boxShadow: '0 50px 140px rgba(0,0,0,0.18)',
							}}>
							<img
								src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85'
								alt='Luxury heated interior'
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									transition: 'transform 7s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'scale(1.05)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'scale(1)';
								}}
							/>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									background:
										'linear-gradient(165deg,transparent 30%,rgba(60,42,37,0.92) 100%)',
								}}
							/>
							<div
								className='wcu-hero-award'
								style={{
									position: 'absolute',
									top: 22,
									left: 22,
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									background: 'rgba(245,185,122,0.2)',
									backdropFilter: 'blur(14px)',
									border: '1px solid rgba(245,185,122,0.38)',
									borderRadius: 999,
									padding: '7px 16px',
								}}>
								<Icon.Trophy size={14} color='#F5B97A' />
								<span
									style={{
										fontFamily: "var(--font-body)",
										fontSize: 10,
										fontWeight: 500,
										letterSpacing: '0.28em',
										textTransform: 'uppercase',
										color: '#F5B97A',
									}}>
									Since 2011
								</span>
							</div>
							<div
								className='wcu-hero-bottom'
								style={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									right: 0,
									padding: '0 28px 28px',
								}}>
								<h3
									className='wcu-hero-h3'
									style={{
										fontFamily: "var(--font-heading)",
										fontSize: 26,
										fontWeight: 600,
										color: 'white',
										lineHeight: 1.2,
										marginBottom: 10,
									}}>
									India #1 Electric Hamam Seller
								</h3>
							
								<div
									style={{
										display: 'flex',
										gap: 8,
										marginTop: 18,
										flexWrap: 'wrap',
									}}>
									{[
										'500K+ India Installs',
										'0.01% Repair Rate',
										'Since 2011',
									].map((s) => (
										<span
											key={s}
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 10,
												fontWeight: 500,
												letterSpacing: '0.06em',
												background: 'rgba(255,255,255,0.12)',
												border: '1px solid rgba(255,255,255,0.18)',
												borderRadius: 999,
												padding: '5px 12px',
												color: 'rgba(255,255,255,0.85)',
												backdropFilter: 'blur(8px)',
											}}>
											{s}
										</span>
									))}
								</div>
							</div>
						</motion.div>

						{STATS.map((s, i) => (
								<motion.div
									key={s.label}
									initial={{ opacity: 0, y: 26 }}
									animate={heroIn ? { opacity: 1, y: 0 } : {}}
									transition={{
										duration: 1,
										ease: EASE,
										delay: 0.12 + i * 0.1,
									}}
									className={`wcu-bento-stat-${i} wcu-stat-card wcu-hover`}
									style={{
										background: 'rgba(255,255,255,0.72)',
										backdropFilter: 'blur(28px)',
										WebkitBackdropFilter: 'blur(28px)',
										border: '1px solid rgba(255,255,255,0.5)',
										borderRadius: 22,
										padding: '22px 22px 20px',
										boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
										display: 'flex',
										flexDirection: 'column',
									}}>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											marginBottom: 14,
										}}>
										<div
											style={{
												width: 40,
												height: 40,
												borderRadius: 12,
												background: `${s.color}15`,
												border: `1px solid ${s.color}28`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}>
											<s.IconComp size={18} color={s.color} />
										</div>
										<span
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 9,
												fontWeight: 700,
												letterSpacing: '0.14em',
												textTransform: 'uppercase',
												color: s.color,
												background: `${s.color}12`,
												border: `1px solid ${s.color}25`,
												borderRadius: 999,
												padding: '4px 10px',
											}}>
											{s.tag}
										</span>
									</div>
									<p
										className='wcu-stat-counter'
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: 'clamp(30px,4vw,42px)',
											fontWeight: 600,
											color: '#B86B45',
											lineHeight: 1,
											letterSpacing: '-0.03em',
											marginBottom: 4,
										}}>
										<Counter display={s.display} />
									</p>
									<p
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 11,
											fontWeight: 600,
											letterSpacing: '0.12em',
											textTransform: 'uppercase',
											color: '#3C2A25',
										}}>
										{s.label}
									</p>
									<p
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 11,
											color: '#6B4A2D',
											marginTop: 2,
											lineHeight: 1.4,
											marginBottom: 14,
										}}>
										{s.sub}
									</p>
									<div
										style={{
											height: 3,
											borderRadius: 2,
											background: 'rgba(184,107,69,0.12)',
											overflow: 'hidden',
											marginBottom: 14,
										}}>
										<motion.div
											initial={{ width: 0 }}
											animate={heroIn ? { width: `${s.pct}%` } : {}}
											transition={{
												duration: 1.4,
												delay: 0.4 + i * 0.12,
												ease: EASE,
											}}
											style={{
												height: '100%',
												borderRadius: 2,
												background: `linear-gradient(90deg, ${s.color}, ${s.color}99)`,
											}}
										/>
									</div>
									<div
										style={{
											height: 1,
											background: 'rgba(184,107,69,0.1)',
											marginBottom: 12,
										}}
									/>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 7,
											marginTop: 'auto',
										}}>
										{s.bullets.map((b) => (
											<div
												key={b}
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: 8,
												}}>
												<div
													style={{
														width: 5,
														height: 5,
														borderRadius: '50%',
														background: s.color,
														flexShrink: 0,
													}}
												/>
												<span
													style={{
														fontFamily: "var(--font-body)",
														fontSize: 11.5,
														color: '#4A3528',
														lineHeight: 1.3,
													}}>
													{b}
												</span>
											</div>
										))}
									</div>
								</motion.div>
							))}
					</div>
				</div>

				{/* ═══ §2 RELIABILITY + GLOBAL ═══ */}
				<div
					ref={reliRef}
					className='wcu-inner-pad relative'
					style={{ zIndex: 2 }}>
					<div className='wcu-reli-grid'>
						<motion.div
							initial={{ opacity: 0, x: -28 }}
							animate={reliIn ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.8, ease: EASE }}>
							<GlassCard style={{ padding: 'clamp(24px,4vw,38px)' }}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'flex-start',
										marginBottom: 28,
										gap: 12,
									}}>
									<div style={{ flex: 1 }}>
										<h3
											style={{
												fontFamily: "var(--font-heading)",
												fontSize: 'clamp(20px,3vw,24px)',
												fontWeight: 600,
												color: '#3C2A25',
												lineHeight: 1.15,
											}}>
										 Built for Kashmiri Winters.
										</h3>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 14,
												color: '#3C2B27',
												marginTop: 8,
												lineHeight: 1.7,
											}}>
											Every system is engineered for decades of
											silent, flawless operation. So you never
											have to think about your floor again.
										</p>
									</div>
									<div
										style={{
											width: 48,
											height: 48,
											borderRadius: '50%',
											flexShrink: 0,
											background: 'rgba(184,107,69,0.12)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											animation: 'wcu-float 4s ease-in-out infinite',
										}}>
										<Icon.ShieldLarge size={22} color='#B86B45' />
									</div>
								</div>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns:
											'repeat(auto-fit, minmax(160px, 1fr))',
										gap: 16,
									}}>
									{[
										{
											IconComp: Icon.Wrench,
											title: 'Near-Zero Failure Rate',
											desc: '0.01% fault rate across 2 million+ global installations. Engineered for extreme cold climates.',
										},
										{
											IconComp: Icon.Refresh,
											title: '24 Hour Replacement Guarantee',
											desc: 'If a system fails, we replace it within 24 hours  anywhere in India.',
										},
										{
											IconComp: Icon.ClipboardCheck,
											title: '10 to 25+ Year Product Warranty',
											desc: 'Every system ships with an industry-leading warranty. Fully transferable. Valid across India.',
										},
										{
											IconComp: Icon.Ruler,
											title: 'Custom Design',
											desc: 'Detailed heating layout plans, cable density maps, and thermostat zone configurations for every project.',
										},
									].map((f) => (
										<div
											key={f.title}
											style={{
												display: 'flex',
												gap: 12,
												alignItems: 'flex-start',
											}}>
											<div
												style={{
													width: 38,
													height: 38,
													borderRadius: 12,
													flexShrink: 0,
													background: 'rgba(245,185,122,0.18)',
													border: '1px solid rgba(245,185,122,0.28)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}>
												<f.IconComp size={16} color='#B86B45' />
											</div>
											<div>
												<p
													style={{
														fontFamily: "var(--font-body)",
														fontSize: 12.5,
														fontWeight: 600,
														color: '#3C2A25',
														lineHeight: 1.3,
													}}>
													{f.title}
												</p>
												<p
													style={{
														fontFamily: "var(--font-body)",
														fontSize: 11,
														color: '#6B4A2D',
														marginTop: 3,
														lineHeight: 1.45,
													}}>
													{f.desc}
												</p>
											</div>
										</div>
									))}
								</div>
							</GlassCard>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 28 }}
							animate={reliIn ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.8, delay: 0.1, ease: EASE }}>
							<GlassCard
								style={{
									padding: 'clamp(24px,4vw,36px)',
									display: 'flex',
									flexDirection: 'column',
									gap: 22,
									height: '100%',
								}}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'flex-start',
										gap: 12,
									}}>
									<div>
										<h3
											style={{
												fontFamily: "var(--font-heading)",
												fontSize: 'clamp(20px,3vw,24px)',
												fontWeight: 600,
												color: '#3C2A25',
											}}>
											Trusted Across 9 Countries
										</h3>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 14,
												color: '#3C2B27',
												marginTop: 6,
											}}>
											From Srinagar to Stockholm, Our electric
											underfloor heating and hamam systems are
											specified by leading architects and
											builders worldwide.
										</p>
									</div>
									<div
										style={{
											width: 48,
											height: 48,
											borderRadius: '50%',
											flexShrink: 0,
											background: 'rgba(184,107,69,0.12)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											animation:
												'wcu-float 5s ease-in-out infinite .5s',
										}}>
										<Icon.GlobeLarge size={22} color='#B86B45' />
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 7,
									}}>
									{COUNTRIES.map((c, i) => (
										<motion.div
											key={c.name}
											initial={{ opacity: 0, scale: 0.75 }}
											animate={reliIn ? { opacity: 1, scale: 1 } : {}}
											transition={{
												duration: 0.3,
												delay: 0.25 + i * 0.05,
											}}
											className='wcu-pill'
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: 7,
												background: 'rgba(255,255,255,0.6)',
												border: '1px solid rgba(255,255,255,0.55)',
												borderRadius: 999,
												padding: '5px 13px',
											}}>
											<Flag code={c.code} name={c.name} />
											<span
												style={{
													fontFamily: "var(--font-body)",
													fontSize: 11.5,
													fontWeight: 500,
													color: '#3C2A25',
												}}>
												{c.name}
											</span>
										</motion.div>
									))}
								</div>
								<div
									style={{
										padding: '16px 20px',
										marginTop: 'auto',
										background:
											'linear-gradient(135deg,rgba(245,185,122,0.25),rgba(255,126,95,0.12))',
										border: '1px solid rgba(245,185,122,0.3)',
										borderRadius: 16,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										flexWrap: 'wrap',
										gap: 16,
									}}>
									<div>
										<p
											style={{
												fontFamily: "var(--font-heading)",
												fontSize: 26,
												fontWeight: 600,
												color: '#B86B45',
												lineHeight: 1,
											}}>
											2M+
										</p>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 11,
												color: '#6B4A2D',
												marginTop: 3,
											}}>
											Systems worldwide
										</p>
										<div
											style={{
												width: 100,
												height: 4,
												borderRadius: 2,
												background: 'rgba(184,107,69,0.15)',
												marginTop: 8,
												overflow: 'hidden',
											}}>
											<motion.div
												initial={{ width: 0 }}
												animate={reliIn ? { width: '85%' } : {}}
												transition={{
													duration: 1.4,
													delay: 0.4,
													ease: EASE,
												}}
												style={{
													height: '100%',
													borderRadius: 2,
													background:
														'linear-gradient(90deg,#E8933A,#FF7E5F)',
												}}
											/>
										</div>
									</div>
									<div style={{ textAlign: 'right' }}>
										<p
											style={{
												fontFamily: "var(--font-heading)",
												fontSize: 20,
												fontWeight: 600,
												color: '#B86B45',
												lineHeight: 1,
											}}>
											500K+
										</p>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 11,
												color: '#6B4A2D',
												marginTop: 3,
											}}>
											In India alone
										</p>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 11,
												color: '#B86B45',
												fontWeight: 600,
												marginTop: 2,
											}}>
											Since 2011
										</p>
									</div>
								</div>
							</GlassCard>
						</motion.div>
					</div>
				</div>

				{/* ═══ §3 PROCESS CAROUSEL ═══ */}
				<OurProcess />

				{/* ═══ §4 BRANDS ═══ */}
				<OurBrands />

				{/* ═══ §5 TESTIMONIALS ═══ */}
				<div
					ref={testiRef}
					className='wcu-testi-pad relative'
					style={{ zIndex: 2 }}>
					<motion.div
						initial={{ opacity: 0, y: 26 }}
						animate={testiIn ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 1, ease: EASE }}
						style={{ marginBottom: 48 }}>
						<SectionHeading
							badge='Customer Stories'
							title="Trusted by Jammu & Kashmir's Leading"
							accent="Architects & Builders"
							sub='Real words from the professionals who specify us on every premium project. '
							center
						/>
					</motion.div>
					<div className='wcu-testi-grid'>
						{TESTIMONIALS.map((t, i) => (
							<motion.div
								key={t.name}
								initial={{ opacity: 0, y: 26 }}
								animate={testiIn ? { opacity: 1, y: 0 } : {}}
								transition={{
									duration: 1,
									ease: EASE,
									delay: i * 0.12,
								}}
								className='wcu-testi'
								style={{
									background: 'rgba(255,255,255,0.68)',
									backdropFilter: 'blur(28px)',
									WebkitBackdropFilter: 'blur(28px)',
									border: '1px solid rgba(255,255,255,0.5)',
									borderRadius: 24,
									boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
									padding:
										'clamp(24px,4vw,32px) clamp(20px,3vw,30px)',
									display: 'flex',
									flexDirection: 'column',
								}}>
								<div
									style={{
										display: 'flex',
										gap: 2,
										marginBottom: 16,
									}}>
									{[1, 2, 3, 4, 5].map((n) => (
										<Icon.Star key={n} size={12} />
									))}
								</div>
								<div
									style={{
										marginBottom: 4,
										opacity: 0.18,
										color: '#B86B45',
									}}>
									<Icon.Quote size={32} color='#B86B45' opacity={1} />
								</div>
								<p
									style={{
										fontFamily: "var(--font-body)",
										fontSize: 14,
										color: '#3C2B27',
										lineHeight: 1.75,
										fontStyle: 'italic',
										marginTop: 8,
										flex: 1,
									}}>
									{t.text}
								</p>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 14,
										marginTop: 28,
										paddingTop: 20,
										borderTop: '1px solid rgba(184,107,69,0.12)',
										flexWrap: 'wrap',
									}}>
									<div
										style={{
											width: 46,
											height: 46,
											borderRadius: '50%',
											flexShrink: 0,
											background:
												'linear-gradient(135deg,#F5B97A,#E8933A)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 15,
											fontWeight: 700,
											color: 'white',
											fontFamily: "var(--font-body)",
										}}>
										{t.initials}
									</div>
									<div style={{ flex: 1, minWidth: 120 }}>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 13.5,
												fontWeight: 600,
												color: '#3C2A25',
											}}>
											{t.name}
										</p>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 11.5,
												color: '#6B4A2D',
												marginTop: 2,
											}}>
											{t.role}
										</p>
									</div>
									<span
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 9,
											fontWeight: 700,
											letterSpacing: '0.08em',
											textTransform: 'uppercase',
											color: '#B86B45',
											background: 'rgba(184,107,69,0.1)',
											border: '1px solid rgba(184,107,69,0.22)',
											borderRadius: 999,
											padding: '5px 11px',
											whiteSpace: 'nowrap',
										}}>
										{t.tag}
									</span>
								</div>
							</motion.div>
						))}
					</div>

				<p className='mt-6 text-center text-sm text-[#4A342E]'>
					Every installation backed by our 25+ year product warranty and CE/ISO-certified systems.{' '}
					<a href='/contact' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>Talk to our experts today</a>.
				</p>
				</div>

				{/* ═══ §6 CTA ═══ */}
				<div
					ref={ctaRef}
					className='wcu-cta-pad relative'
					style={{ zIndex: 2 }}>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={ctaIn ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 1, ease: EASE }}>
						<GlassCard
							hover={false}
							style={{ borderRadius: 28, overflow: 'hidden' }}>
							<div
								style={{
									height: 4,
									background:
										'linear-gradient(90deg,#F5B97A,#FF7E5F 40%,#FFB88C 70%,#F5B97A)',
								}}
							/>
							<div className='wcu-cta-inner'>
								<div>
									<p
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 10,
											fontWeight: 500,
											letterSpacing: '0.35em',
											textTransform: 'uppercase',
											color: '#4FA3D1',
											marginBottom: 14,
										}}>
										Start Your Project Today
									</p>
									<h3
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: 'clamp(24px,4vw,32px)',
											fontWeight: 600,
											color: '#3C2A25',
											lineHeight: 1.15,
										}}>
										India's Most Trusted<br />Underfloor Heating Company
									</h3>
									<p
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 'clamp(14px,2vw,16px)',
											color: '#3C2B27',
											marginTop: 14,
											lineHeight: 1.75,
										}}>
										500,000+ installations across India. Specified
										by leading architects and builders from
										Srinagar to Mumbai. Book your free expert
										consultation.
									</p>
								</div>
								<div className='wcu-cta-divider' />
								<div>
									<p
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 10,
											fontWeight: 600,
											letterSpacing: '0.2em',
											textTransform: 'uppercase',
											color: '#B86B45',
											marginBottom: 14,
										}}>
										Everything Included
									</p>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											gap: 8,
										}}>
										{[
											{ IconComp: Icon.Layers, text: 'Free Consultation' },
											{ IconComp: Icon.BoxOpen, text: 'Custom Design' },
											{
												IconComp: Icon.HardHat,
												text: 'Expert Installation',
											},
											{
												IconComp: Icon.BadgeCheck,
												text: '25+ Year Warranty',
											},
											{
												IconComp: Icon.Chat,
												text: 'Dedicated Support Team',
											},
											{ IconComp: Icon.RotateCw, text: '24h Replacement' },
										].map((s) => (
											<span
												key={s.text}
												style={{
													display: 'inline-flex',
													alignItems: 'center',
													gap: 7,
													fontFamily: "var(--font-body)",
													fontSize: 12,
													fontWeight: 500,
													color: '#3C2B27',
													background: 'rgba(255,255,255,0.7)',
													border: '1px solid rgba(255,216,166,0.6)',
													borderRadius: 999,
													padding: '7px 14px',
												}}>
												<s.IconComp size={13} color='#B86B45' />
												{s.text}
											</span>
										))}
									</div>
								</div>
								<div className='wcu-cta-divider' />
								<div
									className='wcu-cta-btns'
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 12,
										alignItems: 'center',
									}}>
									<a
										href='#contact'
										className='wcu-cta-btn'
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 999,
											padding: '14px 32px',
											fontFamily: "var(--font-body)",
											fontSize: 13,
											fontWeight: 600,
											color: 'white',
											background:
												'linear-gradient(to right,#FF7E5F,#FFB88C)',
											boxShadow: '0 22px 70px rgba(184,107,69,0.45)',
											textDecoration: 'none',
											whiteSpace: 'nowrap',
											border: 'none',
											width: '100%',
										}}>
										Talk to Expert
									</a>
									<a
										href='#process'
										className='wcu-link-btn'
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 8,
											borderRadius: 999,
											border: '1px solid #FFD6A6',
											background: 'rgba(255,255,255,0.7)',
											padding: '10px 24px',
											fontFamily: "var(--font-body)",
											fontSize: 13,
											fontWeight: 500,
											color: '#3C2B27',
											textDecoration: 'none',
											whiteSpace: 'nowrap',
											width: '100%',
										}}>
										View Process{' '}
										<span style={{ color: '#B86B45' }}>→</span>
									</a>
									<p
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 10.5,
											color: '#6B4A2D',
											textAlign: 'center',
											lineHeight: 1.55,
										}}>
										No obligation · Free consultation · Response within 2 hours
									</p>
								</div>
							</div>
						</GlassCard>
					</motion.div>
				</div>

				<MarqueeBar />
			</section>
		</>
	);
}
