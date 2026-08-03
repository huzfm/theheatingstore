'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://evulation-api-electrichamambackend.0psc8x.easypanel.host'
    : 'http://localhost:5050';

const EASE = [0.16, 1, 0.3, 1];

// ── Load Google Maps script ───────────────────────────────────────────────────
function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.google?.maps) { setLoaded(true); return; }
    const existing = document.getElementById('gmap-script');
    if (existing) { existing.addEventListener('load', () => setLoaded(true)); return; }
    const script = document.createElement('script');
    script.id = 'gmap-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);
  return loaded;
}

// ── Map Component ─────────────────────────────────────────────────────────────
function LocationPicker({ value, onChange }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapsLoaded = useGoogleMaps();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(false);

  const noMaps = !MAPS_API_KEY || !mapsLoaded;
  const defaultCenter = { lat: 34.0837, lng: 74.7973 };

  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      const address = status === 'OK' && results[0]
        ? results[0].formatted_address
        : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      onChange({ lat, lng, address });
      if (inputRef.current) inputRef.current.value = address;
      if (markerRef.current) markerRef.current.setPosition({ lat, lng });
      if (mapInstance.current) mapInstance.current.panTo({ lat, lng });
    });
  }, [onChange]);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || mapInstance.current) return;

    const center = value?.lat ? { lat: value.lat, lng: value.lng } : defaultCenter;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#FFF8F0' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#E8D5B0' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#F5E6D0' }] },
        { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#E8C99A' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#D4A06A' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#F0E4D0' }] },
        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#FDF5EA' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#6B4A2D' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#FFF8F0' }] },
      ],
    });

    const marker = new window.google.maps.Marker({
      position: center,
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 13,
        fillColor: '#B86B45',
        fillOpacity: 1,
        strokeColor: '#FFF8F0',
        strokeWeight: 3,
      },
    });

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      reverseGeocode(lat, lng);
    });

    marker.addListener('dragend', () => {
      reverseGeocode(marker.getPosition().lat(), marker.getPosition().lng());
    });

    mapInstance.current = map;
    markerRef.current = marker;

    if (inputRef.current && !autocompleteRef.current) {
      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
      });
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || '';
          onChange({ lat, lng, address });
          marker.setPosition({ lat, lng });
          map.panTo({ lat, lng });
          map.setZoom(16);
        }
      });
      autocompleteRef.current = ac;
    }
  }, [mapsLoaded]);

  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsError('GPS not supported on this device'); return; }
    setGpsLoading(true);
    setGpsError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        reverseGeocode(lat, lng);
        if (mapInstance.current) {
          mapInstance.current.panTo({ lat, lng });
          mapInstance.current.setZoom(17);
        }
        setGpsLoading(false);
      },
      () => {
        setGpsError(true);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (noMaps) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B86B45', pointerEvents: 'none', display: 'flex' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Enter your full address manually..."
            defaultValue={value?.address || ''}
            onChange={(e) => onChange({ address: e.target.value, lat: null, lng: null })}
            style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.5)', outline: 'none', color: '#3C2A25', fontSize: 14, transition: 'all 0.2s' }}
          />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(184,107,69,0.6)', paddingLeft: 4 }}>Enable Google Maps by adding NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B86B45', pointerEvents: 'none', display: 'flex' }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search area, street or landmark..."
          defaultValue={value?.address || ''}
          style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.5)', outline: 'none', color: '#3C2A25', fontSize: 14, transition: 'all 0.2s' }}
        />
      </div>

      <button
        onClick={handleGPS}
        disabled={gpsLoading}
        type="button"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, border: '1.5px solid rgba(196,98,58,0.25)', background: 'rgba(196,98,58,0.06)', color: '#C4623A', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', opacity: gpsLoading ? 0.6 : 1 }}
      >
        {gpsLoading ? (
          <>
            <svg style={{ animation: 'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Detecting location...
          </>
        ) : (
          <>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
            </svg>
            Use My Current Location (GPS)
          </>
        )}
      </button>

      {gpsError && <p style={{ fontSize: 11, color: '#E05252', paddingLeft: 4 }}>Could not get GPS location. Please search or tap the map.</p>}

      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(184,107,69,0.15)', height: 210 }}>
        {!mapsLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0' }}>
            <div style={{ textAlign: 'center' }}>
              <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" color="#B86B45" viewBox="0 0 24 24" fill="none">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p style={{ color: '#B86B45', fontSize: 12, marginTop: 8 }}>Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '4px 12px', fontSize: 10, color: '#6B4A2D', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.6)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          Tap anywhere on map or drag pin
        </div>
      </div>

      {value?.address && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, border: '1px solid rgba(184,107,69,0.2)', background: 'linear-gradient(135deg, rgba(184,107,69,0.08), rgba(212,133,79,0.04))' }}
        >
          <svg style={{ width: 16, height: 16, color: '#C4623A', flexShrink: 0, marginTop: 1 }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <p style={{ fontSize: 11, color: '#3C2A25', fontWeight: 500, lineHeight: 1.6 }}>{value.address}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Icon Components ──────────────────────────────────────────────────────────
const Icon = {
  LivingRoom: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5V19h18v-8.5"/><path d="M1 10.5h22"/><path d="M5 10.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3.5"/><rect x="6" y="14" width="5" height="5" rx="1"/><rect x="13" y="14" width="5" height="5" rx="1"/>
    </svg>
  ),
  Kitchen: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/><circle cx="7" cy="6.5" r="1"/><circle cx="12" cy="6.5" r="1"/><circle cx="17" cy="6.5" r="1"/><rect x="6" y="12" width="5" height="5" rx="1"/>
    </svg>
  ),
  Bathroom: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/><path d="M6 12V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1"/><line x1="4" y1="12" x2="20" y2="12"/>
    </svg>
  ),
  Bedroom: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9V19"/><path d="M22 9v10"/><path d="M2 14h20"/><path d="M2 19h20"/><path d="M2 9h20"/><path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><rect x="6" y="9" width="5" height="5" rx="1"/>
    </svg>
  ),
  Lobby: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V7l9-4 9 4v14"/><path d="M9 21V12h6v9"/><rect x="9" y="12" width="6" height="9"/><path d="M3 7h18"/>
    </svg>
  ),
  Concrete: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/><line x1="9" y1="4" x2="9" y2="8"/><line x1="15" y1="4" x2="15" y2="8"/><line x1="7" y1="10" x2="7" y2="14"/><line x1="13" y1="10" x2="13" y2="14"/><line x1="11" y1="16" x2="11" y2="20"/>
    </svg>
  ),
  Timber: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="3" rx="0.5"/><rect x="2" y="10" width="20" height="3" rx="0.5"/><rect x="2" y="15" width="20" height="3" rx="0.5"/><line x1="8" y1="5" x2="8" y2="8"/><line x1="14" y1="10" x2="14" y2="13"/><line x1="6" y1="15" x2="6" y2="18"/>
    </svg>
  ),
  Carpet: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2"/><line x1="7" y1="6" x2="7" y2="18"/><line x1="11" y1="6" x2="11" y2="18"/><line x1="15" y1="6" x2="15" y2="18"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/>
    </svg>
  ),
  Tile: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="0.5"/><rect x="13" y="3" width="8" height="8" rx="0.5"/><rect x="3" y="13" width="8" height="8" rx="0.5"/><rect x="13" y="13" width="8" height="8" rx="0.5"/>
    </svg>
  ),
  WoodFloor: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="5" rx="0.5"/><rect x="2" y="11" width="20" height="5" rx="0.5"/><rect x="2" y="18" width="20" height="3" rx="0.5"/><line x1="9" y1="4" x2="9" y2="9"/><line x1="15" y1="11" x2="15" y2="16"/>
    </svg>
  ),
  // Premium surface icons for Step 3
  CarpetIcon: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <line x1="2" y1="7" x2="22" y2="7"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
      <line x1="2" y1="13" x2="22" y2="13"/>
      <line x1="2" y1="16" x2="22" y2="16"/>
      <line x1="5" y1="4" x2="5" y2="20"/>
      <line x1="8" y1="4" x2="8" y2="20"/>
      <line x1="11" y1="4" x2="11" y2="20"/>
      <line x1="14" y1="4" x2="14" y2="20"/>
      <line x1="17" y1="4" x2="17" y2="20"/>
      <line x1="20" y1="4" x2="20" y2="20"/>
      <circle cx="6.5" cy="8.5" r="0.5" fill="currentColor"/>
      <circle cx="9.5" cy="11.5" r="0.5" fill="currentColor"/>
      <circle cx="12.5" cy="8.5" r="0.5" fill="currentColor"/>
      <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor"/>
      <circle cx="18.5" cy="8.5" r="0.5" fill="currentColor"/>
    </svg>
  ),
  TileIcon: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="0.5"/>
      <rect x="13" y="2" width="9" height="9" rx="0.5"/>
      <rect x="2" y="13" width="9" height="9" rx="0.5"/>
      <rect x="13" y="13" width="9" height="9" rx="0.5"/>
      <line x1="4" y1="4" x2="6" y2="4"/>
      <line x1="15" y1="4" x2="17" y2="4"/>
      <line x1="4" y1="15" x2="6" y2="15"/>
      <line x1="15" y1="15" x2="17" y2="15"/>
      <line x1="4" y1="6" x2="4" y2="9"/>
      <line x1="15" y1="6" x2="15" y2="9"/>
    </svg>
  ),
  WoodFloorIcon: () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="5" rx="0.5"/>
      <rect x="2" y="10" width="20" height="5" rx="0.5"/>
      <rect x="2" y="17" width="20" height="4" rx="0.5"/>
      <line x1="10" y1="3" x2="10" y2="8"/>
      <line x1="16" y1="10" x2="16" y2="15"/>
      <line x1="7" y1="17" x2="7" y2="21"/>
      <path d="M4 5.5 Q6 5 8 5.5"/>
      <path d="M12 12 Q14 11.5 16 12"/>
      <path d="M4 19 Q5.5 18.5 7 19"/>
    </svg>
  ),
  StandardThermostat: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="7.8" y2="7.8"/><line x1="16.2" y1="16.2" x2="18.4" y2="18.4"/>
    </svg>
  ),
  ModularThermostat: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><circle cx="9" cy="16" r="1.5"/><circle cx="15" cy="16" r="1.5"/>
    </svg>
  ),
  WiFiThermostat: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8.5 7.5a5 5 0 0 1 7 0"/><path d="M10.5 10a2.5 2.5 0 0 1 3 0"/><circle cx="12" cy="15" r="1.5"/><line x1="12" y1="16.5" x2="12" y2="19"/>
    </svg>
  ),
  XPLEInsulation: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="5" rx="1"/><rect x="2" y="11" width="20" height="3" rx="0.5"/><rect x="2" y="16" width="20" height="4" rx="1"/><path d="M6 4v5"/><path d="M10 4v5"/><path d="M14 4v5"/><path d="M18 4v5"/>
    </svg>
  ),
  XPSInsulation: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="8" y1="5" x2="8" y2="19"/><line x1="14" y1="5" x2="14" y2="19"/><line x1="2" y1="10" x2="20" y2="10"/><line x1="2" y1="15" x2="20" y2="15"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Location: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  GPS: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
    </svg>
  ),
  Edit: () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Back: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Restart: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  ),
  Zap: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Grid: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Ruler: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M3 6v12"/><path d="M3 6l3-3 3 3 3-3 3 3 3-3 3 3"/><path d="M6 18v3"/><path d="M12 18v3"/><path d="M18 18v3"/>
    </svg>
  ),
  Insulation: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 16h18M9 4v16M15 4v16"/>
    </svg>
  ),
};

// ── Card Styles ──────────────────────────────────────────────────────────────
const cardBase = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: 22,
  boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
};

const cardSelected = {
  border: '2px solid #C4623A',
  boxShadow: '0 0 0 4px rgba(196,98,58,0.10)',
};

// ── Step variants for AnimatePresence ────────────────────────────────────────
const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.35, ease: EASE } }),
};

// ── Glass Input ──────────────────────────────────────────────────────────────
const glassInput = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(255,255,255,0.50)',
  borderRadius: 12,
  padding: '10px 16px',
  fontSize: 14,
  color: '#2C1810',
  fontFamily: "var(--font-body)",
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

// ── Pill Toggle ───────────────────────────────────────────────────────────────
function UnitToggle({ value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px', borderRadius: 999, background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.45)' }}>
      {[['feet', 'Feet (ft)'], ['meters', 'Meters (m)']].map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          style={{
            padding: '6px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            background: value === val ? 'linear-gradient(135deg, #C4623A, #E88C2A)' : 'transparent',
            color: value === val ? 'white' : '#6B4A2D',
            boxShadow: value === val ? '0 4px 12px rgba(196,98,58,0.3)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Option Card ───────────────────────────────────────────────────────────────
function OptionCard({ selected, onClick, icon: IconComp, label, sublabel, infoChip, badge, badgeColor, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardBase,
        ...(selected ? cardSelected : {}),
        padding: '28px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 12,
        cursor: 'pointer',
        transform: hovered && !selected ? 'translateY(-4px)' : selected ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !selected ? '0 20px 60px rgba(60,42,37,0.12)' : selected ? cardSelected.boxShadow : cardBase.boxShadow,
      }}
    >
      {selected && (
        <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: '#C4623A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      )}
      {badge && !selected && (
        <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: badgeColor ? `${badgeColor}18` : '#3C2A25', color: badgeColor || 'white', border: `1px solid ${badgeColor ? badgeColor + '30' : 'transparent'}`, fontFamily: "var(--font-body)" }}>
          {badge}
        </div>
      )}
      {IconComp && (
        <div style={{ color: selected ? '#C4623A' : '#2C1810' }}>
          <IconComp />
        </div>
      )}
      {label && (
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', fontWeight: 600, color: '#2C1810', lineHeight: 1.2, margin: 0 }}>
          {label}
        </h3>
      )}
      {sublabel && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#6B4A2D', lineHeight: 1.5, margin: 0 }}>
          {sublabel}
        </p>
      )}
      {infoChip && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: 10.5, color: '#C4623A', background: 'rgba(196,98,58,0.08)', padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>
          {infoChip}
        </span>
      )}
      {children}
    </button>
  );
}

// ── Primary Button ─────────────────────────────────────────────────────────────
function PrimaryButton({ children, onClick, disabled, loading }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '14px 28px',
        background: 'linear-gradient(135deg, #C4623A, #E88C2A)',
        color: 'white',
        border: 'none',
        borderRadius: 16,
        fontFamily: "var(--font-body)",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: '0 8px 24px rgba(196,98,58,0.35)',
        transform: hovered && !disabled ? 'scale(1.02)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Submitting...
        </span>
      ) : children}
    </button>
  );
}

// ── Step Heading ──────────────────────────────────────────────────────────────
function StepHeading({ children }) {
  return (
    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#2C1810', margin: '0 0 12px', textAlign: 'center', lineHeight: 1.1 }}>
      {children}
    </h2>
  );
}

function StepSub({ children }) {
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: '#6B4A2D', lineHeight: 1.65, margin: '0 0 36px', textAlign: 'center', maxWidth: 520 }}>
      {children}
    </p>
  );
}

// ── Summary Row ───────────────────────────────────────────────────────────────
function SummaryRow({ icon: IconComp, label, value, color = '#C4623A', onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #E8D5C0' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
        <IconComp />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: '#6B4A2D', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: '#2C1810', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{value}</p>
      </div>
      {onEdit && (
        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "var(--font-body)", fontSize: 11, color: '#C4623A', textDecoration: 'underline', flexShrink: 0, padding: '4px 0' }}>
          Edit
        </button>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SpaceVerification() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roomType, setRoomType] = useState('');
  const [subfloor, setSubfloor] = useState('');
  const [floorSurface, setFloorSurface] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('feet');
  const [heatedPercent, setHeatedPercent] = useState(75);
  const [thermostat, setThermostat] = useState('');
  const [insulation, setInsulation] = useState('');
  const [insulationThickness, setInsulationThickness] = useState('6mm');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const sliderRef = useRef(null);

  const totalSteps = 9;

  const totalArea = (length && width) ? (parseFloat(length) * parseFloat(width)).toFixed(1) : null;
  const heatedArea = totalArea ? ((parseFloat(totalArea) * heatedPercent) / 100).toFixed(1) : null;

  const getSliderColor = () => {
    if (heatedPercent < 70) return '#E05252';
    if (heatedPercent <= 80) return '#6BAE7F';
    return '#E88C2A';
  };

  const getSliderStatus = () => {
    if (heatedPercent < 70) return { color: '#E05252', text: '⚠ Not recommended, insufficient coverage for efficient heating', type: 'warn' };
    if (heatedPercent <= 80) return { color: '#6BAE7F', text: '✓ Recommended coverage for comfort and efficiency', type: 'good' };
    return { color: '#E88C2A', text: '↑ High coverage, ensure no fixed furniture in heated zone', type: 'high' };
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--val', heatedPercent);
      const color = getSliderColor();
      sliderRef.current.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${heatedPercent}%, #E8D5C0 ${heatedPercent}%, #E8D5C0 100%)`;
    }
  }, [heatedPercent]);

  const goToStep = (s) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setStep(1);
    setRoomType('');
    setSubfloor('');
    setFloorSurface('');
    setLength('');
    setWidth('');
    setMeasurementUnit('feet');
    setHeatedPercent(75);
    setThermostat('');
    setInsulation('');
    setInsulationThickness('6mm');
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setLocation(null);
    setSubmitted(false);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/detailed-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email, message,
          roomType, subfloor, floorSurface, flooringType: floorSurface,
          length, width, measurementUnit,
          totalArea, heatedArea, heatedPercent,
          thermostat, insulation, insulationThickness,
          customerAddress: location?.address || '',
          customerLat: location?.lat || null,
          customerLng: location?.lng || null,
          googleMapsLink: location?.lat ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : '',
          source: 'Space Verification',
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style>{`
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .insulation-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 380px));
    gap: 24px;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  .insulation-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  }
  .insulation-card:hover {
    transform: translateY(-5px) !important;
  }
  @media (max-width: 640px) {
    .insulation-grid {
      grid-template-columns: 1fr;
      max-width: 400px;
    }
  }
`}</style>
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 45%, #FFE8D0 100%)',
          overflow: 'hidden', zIndex: 9999,
        }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)' }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              ...cardBase, maxWidth: 440, width: '90%', padding: '48px 36px',
              textAlign: 'center', position: 'relative', zIndex: 1, margin: 16,
            }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C4623A, #E88C2A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px', boxShadow: '0 16px 48px rgba(196,98,58,0.4)',
            }}>
              <Icon.CheckCircle />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 700, color: '#2C1810', margin: '0 0 16px' }}>
              Space Details Submitted!
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: '#6B4A2D', lineHeight: 1.65, margin: '0 0 24px' }}>
              Thank you, <strong>{name}</strong>. We'll review your configuration and reach out on <strong>{phone}</strong> with a custom installation plan.
            </p>
            {location?.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 14, textAlign: 'left', color: '#C4623A' }}>
                <span style={{ marginTop: 2, flexShrink: 0 }}><Icon.Location /></span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#6B4A2D', lineHeight: 1.6, margin: 0 }}>{location.address}</p>
              </div>
            )}
          </motion.div>
        </div>
      </>
    );
  }

  const roomIcons = { living: Icon.LivingRoom, kitchen: Icon.Kitchen, bathroom: Icon.Bathroom, bedroom: Icon.Bedroom, lobby: Icon.Lobby };
  const roomLabels = { living: 'Living Room', kitchen: 'Kitchen', bathroom: 'Bathroom', bedroom: 'Bedroom', lobby: 'Lobby' };
  const roomColors = { living: '#E88C2A', kitchen: '#4FA3D1', bathroom: '#8B3A2A', bedroom: '#6BAE7F', lobby: '#C4623A' };
  const subfloorIcons = { concrete: Icon.Concrete, timber: Icon.Timber };
  const subfloorLabels = { concrete: 'Concrete', timber: 'Timber' };
  const subfloorSubs = { concrete: 'Solid concrete or screed base', timber: 'Suspended timber joists or chipboard' };
  const subfloorChips = { concrete: 'Compatible with all heating systems', timber: 'Foil systems recommended' };
  const subfloorColors = { concrete: '#8B3A2A', timber: '#E88C2A' };
  const surfaceIcons = { carpet: Icon.Carpet, tile: Icon.Tile, wood: Icon.WoodFloor };
  const surfaceLabels = { carpet: 'Carpet', tile: 'Tile', wood: 'Wood / Laminate' };
  const surfaceSubs = { carpet: 'Low tog only (≤1.5 tog)', tile: 'Ceramic, porcelain or stone', wood: 'Engineered wood or laminate boards' };
  const surfaceChips = { carpet: 'Loose-lay heating foil recommended', tile: 'Heating mat in adhesive', wood: 'Loose-lay foil system' };
  const surfaceColors = { carpet: '#6BAE7F', tile: '#4FA3D1', wood: '#C4623A' };
  const thermostatIcons = { standard: Icon.StandardThermostat, modular: Icon.ModularThermostat, wifi: Icon.WiFiThermostat };
  const thermostatLabels = { standard: 'Standard Thermostat', modular: 'Modular Thermostat', wifi: 'WiFi Smart Thermostat' };
  const thermostatSubs = { standard: 'Manual dial control', modular: 'Programmable weekly schedule', wifi: 'App + voice control' };
  const thermostatDescs = {
    standard: 'Simple to use, reliable and cost-effective. Basic on/off scheduling.',
    modular: '7-day programming with multiple temperature periods. Fits standard electrical backboxes.',
    wifi: 'Control from anywhere via smartphone. Compatible with Alexa, Google Home and Apple HomeKit.',
  };
  const thermostatColors = { standard: '#E88C2A', modular: '#4FA3D1', wifi: '#6BAE7F' };
  const insulationIcons = { xple: Icon.XPLEInsulation, xps: Icon.XPSInsulation };
  const insulationLabels = { xple: 'XPLE Insulation', xps: 'XPS Insulation' };
  const insulationSubs = { xple: 'Cross-linked polyethylene foam', xps: 'Extruded polystyrene rigid board' };
  const insulationDescs = {
    xple: 'Flexible, lightweight and easy to install. Works under all floor types.',
    xps: 'Maximum thermal efficiency. Rigid boards ideal for concrete subfloors. Higher R-value than foam.',
  };
  const insulationColors = { xple: '#E88C2A', xps: '#8B3A2A' };

  const unitLabel = measurementUnit === 'feet' ? 'sq ft' : 'm²';

  const SUBFLOORS = [
    {
      id: 'concrete',
      label: 'Concrete',
      sublabel: 'Solid concrete or screed base',
      chip: 'Compatible with all heating systems',
      chipColor: '#8B3A2A',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=90&auto=format&fit=crop',
    },
    {
      id: 'timber',
      label: 'Timber',
      sublabel: 'Suspended timber joists or chipboard',
      chip: 'Foil systems recommended',
      chipColor: '#E88C2A',
      img: '/images/timber.png',
    },
  ];

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fr-section { position: relative; overflow: hidden; }
        .fr-glow { position: absolute; inset: 0; pointer-events: none; }
        .fr-content { max-width: 1320px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1; }
        .fr-topbar { position: sticky; top: 0; z-index: 200; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.4); padding: 14px 24px; }
        .fr-pbar { height: 3px; background: #E8D5C0; }
        .fr-pbar-fill { height: 100%; background: linear-gradient(90deg, #C4623A, #E88C2A); transition: width 0.5s ease; }
        .glass-input { background: rgba(255,255,255,0.80); border: 1px solid rgba(255,255,255,0.50); border-radius: 12px; padding: 11px 16px; font-size: 14px; color: #2C1810; font-family: var(--font-body); width: 100%; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .glass-input:focus { border-color: rgba(196,98,58,0.5); box-shadow: 0 0 0 3px rgba(196,98,58,0.12); }
        .glass-input::placeholder { color: rgba(107,74,45,0.45); }
        input[type="range"].fr-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; outline: none; cursor: pointer; }
        input[type="range"].fr-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: white; border: 2px solid #C4623A; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; }
        input[type="range"].fr-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: white; border: 2px solid #C4623A; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; }
        .premium-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }
        .premium-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid #C4623A;
          box-shadow: 0 4px 16px rgba(196,98,58,0.35);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .premium-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(196,98,58,0.45);
        }
        .premium-slider::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid #C4623A;
          box-shadow: 0 4px 16px rgba(196,98,58,0.35);
          cursor: pointer;
        }
        .pill-selected { background: linear-gradient(135deg, #C4623A, #E88C2A); color: white; }
        .pill-option { border: 1.5px solid rgba(196,98,58,0.35); background: rgba(196,98,58,0.06); color: #C4623A; }
        .room-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 200px)); gap: 16px; justify-content: center; width: 100%; max-width: 1100px; margin: 0 auto; }
        .room-card:hover img { transform: scale(1.06) !important; }
        @media (max-width: 900px) { .room-grid { grid-template-columns: repeat(3, 1fr); max-width: 600px; } }
        @media (max-width: 560px) { .room-grid { grid-template-columns: repeat(2, 1fr); max-width: 100%; gap: 12px; } }
        @media (max-width: 360px) { .room-grid { grid-template-columns: 1fr; max-width: 260px; } }
        @media (max-width: 768px) { .fr-content { padding: 0 20px; } .fr-topbar { padding: 12px 16px; } }
        @media (max-width: 480px) { .fr-content { padding: 0 16px; } }
        .subfloor-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 340px)); gap: 20; justify-content: center; width: 100%; max-width: 720; margin: 0 auto; }
        .subfloor-card:hover img { transform: scale(1.06) !important; }
        @media (max-width: 560px) { .subfloor-grid { grid-template-columns: 1fr !important; max-width: 100% !important; } }
        .surface-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 280px)); gap: 20px; justify-content: center; width: 100%; max-width: 900px; margin: 0 auto; }
        @media (max-width: 768px) { .surface-grid { grid-template-columns: repeat(3, 1fr); max-width: 100%; gap: 12px; } }
        @media (max-width: 560px) { .surface-grid { grid-template-columns: 1fr; max-width: 360px; } }
        .surface-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
        .surface-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 60px rgba(60,42,37,0.12) !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }
        .thermostat-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 300px)); gap: 20px; justify-content: center; width: 100%; max-width: 980px; margin: 0 auto; }
        .thermostat-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
        .thermostat-card:hover { transform: translateY(-6px) !important; }
        @media (max-width: 768px) { .thermostat-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
        @media (max-width: 560px) { .thermostat-grid { grid-template-columns: 1fr; max-width: 360px; } }
      `}</style>

      <div className="fr-section" style={{ backgroundImage: 'linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 45%,#FFE8D0 100%)', minHeight: '100vh' }}>
        <div className="fr-glow" style={{ background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)' }} />

        {/* ── Top Bar ── */}
        <div className="fr-topbar">
          <div className="fr-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900 }}>
            <button
              onClick={() => step > 1 && goToStep(step - 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B4A2D',
                background: 'none', border: 'none', cursor: step > 1 ? 'pointer' : 'default',
                opacity: step > 1 ? 1 : 0,
                padding: 0, transition: 'opacity 0.2s',
              }}
            >
              <Icon.Back /> Back
            </button>

            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B4A2D' }}>
              Step {step} of {totalSteps}
            </span>

            <button
              onClick={handleReset}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B4A2D', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'opacity 0.2s' }}
            >
              <Icon.Restart /> Start Again
            </button>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="fr-pbar">
          <div className="fr-pbar-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        {/* ── Step Content ── */}
        <div style={{
          minHeight: 'calc(100vh - 52px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="fr-content" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>

                {/* ── STEP 1: Room Type ── */}
                {step === 1 && (
                  <>
                    <div style={{
                      textAlign: 'center',
                      maxWidth: 640,
                      margin: '0 auto 40px',
                    }}>
                      <h1 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 'clamp(28px, 5vw, 48px)',
                        fontWeight: 700,
                        color: '#2C1810',
                        lineHeight: 1.15,
                        margin: '0 0 16px',
                      }}>
                        Which room are you heating?
                      </h1>
                    
                    </div>
                    <div className="room-grid">
                      {[
                        { id: 'living', label: 'Living Room', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=75&auto=format&fit=crop' },
                        { id: 'kitchen', label: 'Kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=75&auto=format&fit=crop' },
                        { id: 'bathroom', label: 'Bathroom', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&q=75&auto=format&fit=crop' },
                        { id: 'bedroom', label: 'Bedroom', img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=75&auto=format&fit=crop' },
                        { id: 'lobby', label: 'Lobby', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90&auto=format&fit=crop' },
                      ].map((room, i) => (
                        <motion.div
                          key={room.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                        >
                          <button
                            onClick={() => { setRoomType(room.id); setTimeout(() => goToStep(2), 300); }}
                            className="room-card"
                            style={{
                              background: roomType === room.id
                                ? 'rgba(255,255,255,0.95)'
                                : 'rgba(255,255,255,0.72)',
                              backdropFilter: 'blur(28px)',
                              WebkitBackdropFilter: 'blur(28px)',
                              border: roomType === room.id
                                ? '2px solid #C4623A'
                                : '1px solid rgba(255,255,255,0.5)',
                              borderRadius: 22,
                              boxShadow: roomType === room.id
                                ? '0 0 0 4px rgba(196,98,58,0.10), 0 20px 60px rgba(60,42,37,0.12)'
                                : '0 8px 32px rgba(60,42,37,0.07)',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              position: 'relative',
                              padding: 0,
                              textAlign: 'center',
                              width: '100%',
                            }}
                          >
                            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0', height: 140 }}>
                              <Image
                                src={room.img}
                                alt={room.label}
                                fill
                                loading="lazy"
                                sizes="(max-width: 640px) 50vw, 220px"
                                quality={72}
                                style={{
                                  objectFit: 'cover',
                                  transition: 'transform 0.4s ease',
                                  transform: roomType === room.id ? 'scale(1.05)' : 'scale(1)',
                                }}
                              />
                            </div>
                            {roomType === room.id && (
                              <div style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: '#C4623A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(196,98,58,0.5)',
                              }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                            <div style={{
                              padding: '14px 12px 16px',
                              fontFamily: "var(--font-heading)",
                              fontSize: 16,
                              fontWeight: 600,
                              color: roomType === room.id ? '#C4623A' : '#2C1810',
                              transition: 'color 0.2s ease',
                            }}>
                              {room.label}
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── STEP 2: Subfloor ── */}
                {step === 2 && (
                  <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <StepHeading>What type of subfloor do you have?</StepHeading>
                   
                    <div className="subfloor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 340px))', gap: 20, justifyContent: 'center', width: '100%', maxWidth: 720, margin: '0 auto' }}>
                      {SUBFLOORS.map((floor, i) => (
                        <motion.div
                          key={floor.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                        >
                          <button
                            className="subfloor-card"
                            onClick={() => { setSubfloor(floor.id); setTimeout(() => goToStep(3), 300); }}
                            style={{
                              background: subfloor === floor.id
                                ? 'rgba(255,255,255,0.95)'
                                : 'rgba(255,255,255,0.72)',
                              backdropFilter: 'blur(28px)',
                              WebkitBackdropFilter: 'blur(28px)',
                              border: subfloor === floor.id
                                ? '2px solid #C4623A'
                                : '1px solid rgba(255,255,255,0.5)',
                              borderRadius: 22,
                              boxShadow: subfloor === floor.id
                                ? '0 0 0 4px rgba(196,98,58,0.10), 0 20px 60px rgba(60,42,37,0.12)'
                                : '0 8px 32px rgba(60,42,37,0.07)',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              position: 'relative',
                              padding: 0,
                              textAlign: 'center',
                              width: '100%',
                            }}
                          >
                            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0', height: 180 }}>
                              <Image
                                src={floor.img}
                                alt={floor.label}
                                fill
                                loading="lazy"
                                sizes="(max-width: 640px) 90vw, 340px"
                                quality={72}
                                style={{
                                  objectFit: 'cover',
                                  transition: 'transform 0.4s ease',
                                  transform: subfloor === floor.id ? 'scale(1.05)' : 'scale(1)',
                                }}
                              />
                            </div>
                            {subfloor === floor.id && (
                              <div style={{
                                position: 'absolute', top: 10, right: 10,
                                width: 24, height: 24, borderRadius: '50%',
                                background: '#C4623A',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(196,98,58,0.5)',
                              }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                            <div style={{ padding: '16px 20px 20px' }}>
                              <div style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: 20,
                                fontWeight: 600,
                                color: subfloor === floor.id ? '#C4623A' : '#2C1810',
                                marginBottom: 6,
                                transition: 'color 0.2s ease',
                              }}>
                                {floor.label}
                              </div>
                              <div style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 13,
                                color: '#6B4A2D',
                                marginBottom: 12,
                                lineHeight: 1.5,
                              }}>
                                {floor.sublabel}
                              </div>
                              <div style={{
                                display: 'inline-block',
                                fontFamily: "var(--font-body)",
                                fontSize: 11,
                                fontWeight: 600,
                                color: floor.chipColor,
                                background: `${floor.chipColor}15`,
                                border: `1px solid ${floor.chipColor}30`,
                                borderRadius: 999,
                                padding: '4px 12px',
                              }}>
                                {floor.chip}
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Floor Surface ── */}
                {step === 3 && (
                  <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <StepHeading>What floor surface are you installing over?</StepHeading>
                   
                    <div className="surface-grid">
                      {[
                        { id: 'carpet', label: 'Carpet', sublabel: 'Low tog only (≤1.5 tog)', chip: 'Loose-lay foil recommended', color: '#6BAE7F', icon: <Icon.CarpetIcon /> },
                        { id: 'tile', label: 'Tile', sublabel: 'Ceramic, porcelain or stone', chip: 'Heating mat in adhesive', color: '#4FA3D1', icon: <Icon.TileIcon /> },
                        { id: 'wood', label: 'Wood / Laminate', sublabel: 'Engineered wood or laminate boards', chip: 'Loose-lay foil system', color: '#C4623A', icon: <Icon.WoodFloorIcon /> },
                      ].map((surface, i) => (
                        <motion.div
                          key={surface.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                        >
                          <button
                            onClick={() => { setFloorSurface(surface.id); setTimeout(() => goToStep(4), 300); }}
                            className="surface-card"
                            style={{
                              background: floorSurface === surface.id
                                ? 'rgba(255,255,255,0.97)'
                                : 'rgba(255,255,255,0.72)',
                              backdropFilter: 'blur(28px)',
                              WebkitBackdropFilter: 'blur(28px)',
                              border: floorSurface === surface.id
                                ? `2px solid ${surface.color}`
                                : '1px solid rgba(255,255,255,0.5)',
                              borderRadius: 22,
                              boxShadow: floorSurface === surface.id
                                ? `0 0 0 4px ${surface.color}18, 0 20px 60px rgba(60,42,37,0.12)`
                                : '0 8px 32px rgba(60,42,37,0.07)',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              position: 'relative',
                              padding: '32px 24px 28px',
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 0,
                              width: '100%',
                            }}
                          >
                            {/* Icon container, colored bg circle */}
                            <div style={{
                              width: 72,
                              height: 72,
                              borderRadius: 20,
                              background: `${surface.color}15`,
                              border: `1.5px solid ${surface.color}35`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              color: surface.color,
                              transition: 'all 0.25s ease',
                              transform: floorSurface === surface.id ? 'scale(1.08)' : 'scale(1)',
                              boxShadow: floorSurface === surface.id
                                ? `0 8px 24px ${surface.color}30`
                                : 'none',
                            }}>
                              {surface.icon}
                            </div>

                            {/* Label */}
                            <div style={{
                              fontFamily: "var(--font-heading)",
                              fontSize: 22,
                              fontWeight: 600,
                              color: floorSurface === surface.id ? surface.color : '#2C1810',
                              marginBottom: 8,
                              transition: 'color 0.2s ease',
                            }}>
                              {surface.label}
                            </div>

                            {/* Sublabel */}
                            <div style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              color: '#6B4A2D',
                              lineHeight: 1.5,
                              marginBottom: 16,
                            }}>
                              {surface.sublabel}
                            </div>

                            {/* Chip */}
                            <div style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: surface.color,
                              background: `${surface.color}12`,
                              border: `1px solid ${surface.color}30`,
                              borderRadius: 999,
                              padding: '5px 14px',
                            }}>
                              {surface.chip}
                            </div>

                            {/* Selected checkmark */}
                            {floorSurface === surface.id && (
                              <div style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                width: 26,
                                height: 26,
                                borderRadius: '50%',
                                background: surface.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 2px 8px ${surface.color}60`,
                              }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </div>
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Room Dimensions ── */}
                {step === 4 && (
                  <div style={{
                    minHeight: 'calc(100vh - 52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
                      <h1 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 'clamp(28px, 5vw, 46px)',
                        fontWeight: 700,
                        color: '#2C1810',
                        lineHeight: 1.15,
                        margin: '0 0 14px',
                      }}>
                        What are your room dimensions?
                      </h1>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: '#6B4A2D',
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        Enter the full length and width of the room.
                      </p>
                    </div>

                    <div style={{
                      width: '100%',
                      maxWidth: 500,
                      background: 'rgba(255,255,255,0.82)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      borderRadius: 28,
                      boxShadow: '0 8px 40px rgba(60,42,37,0.09)',
                      padding: '36px 32px 32px',
                    }}>
                      <div style={{
                        display: 'flex',
                        background: 'rgba(196,98,58,0.08)',
                        border: '1px solid rgba(196,98,58,0.2)',
                        borderRadius: 999,
                        padding: 4,
                        width: 'fit-content',
                        margin: '0 auto 32px',
                      }}>
                        {[
                          { val: 'feet', label: 'Feet (ft)' },
                          { val: 'm', label: 'Meters (m)' },
                        ].map(u => (
                          <button
                            key={u.val}
                            onClick={() => setMeasurementUnit(u.val)}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 14,
                              fontWeight: 600,
                              padding: '8px 28px',
                              borderRadius: 999,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              background: measurementUnit === u.val
                                ? 'linear-gradient(135deg, #C4623A, #E88C2A)'
                                : 'transparent',
                              color: measurementUnit === u.val ? '#fff' : '#6B4A2D',
                              boxShadow: measurementUnit === u.val
                                ? '0 4px 16px rgba(196,98,58,0.35)'
                                : 'none',
                            }}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 8,
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#C4623A',
                            textAlign: 'center',
                          }}>
                            Length ({measurementUnit === 'feet' ? 'ft' : 'm'})
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 15"
                            value={length}
                            onChange={e => setLength(e.target.value)}
                            style={{
                              width: '100%',
                              fontFamily: "var(--font-heading)",
                              fontSize: 36,
                              fontWeight: 600,
                              color: '#2C1810',
                              background: length ? 'rgba(196,98,58,0.04)' : 'rgba(255,255,255,0.9)',
                              border: length
                                ? '2px solid #C4623A'
                                : '1.5px solid rgba(196,98,58,0.2)',
                              borderRadius: 18,
                              padding: '18px 16px',
                              outline: 'none',
                              textAlign: 'center',
                              boxSizing: 'border-box',
                              transition: 'all 0.2s ease',
                              MozAppearance: 'textfield',
                            }}
                          />
                        </div>

                        <div style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: 36,
                          color: '#C4623A',
                          opacity: 0.4,
                          paddingTop: 28,
                          userSelect: 'none',
                        }}>×</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#C4623A',
                            textAlign: 'center',
                          }}>
                            Width ({measurementUnit === 'feet' ? 'ft' : 'm'})
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 12"
                            value={width}
                            onChange={e => setWidth(e.target.value)}
                            style={{
                              width: '100%',
                              fontFamily: "var(--font-heading)",
                              fontSize: 36,
                              fontWeight: 600,
                              color: '#2C1810',
                              background: width ? 'rgba(196,98,58,0.04)' : 'rgba(255,255,255,0.9)',
                              border: width
                                ? '2px solid #C4623A'
                                : '1.5px solid rgba(196,98,58,0.2)',
                              borderRadius: 18,
                              padding: '18px 16px',
                              outline: 'none',
                              textAlign: 'center',
                              boxSizing: 'border-box',
                              transition: 'all 0.2s ease',
                              MozAppearance: 'textfield',
                            }}
                          />
                        </div>
                      </div>

                      {length && width && parseFloat(length) > 0 && parseFloat(width) > 0 && (
                        <div style={{
                          marginTop: 28,
                          background: 'linear-gradient(135deg, rgba(196,98,58,0.07), rgba(232,140,42,0.07))',
                          border: '1.5px solid rgba(196,98,58,0.18)',
                          borderRadius: 20,
                          padding: '22px 24px 18px',
                          textAlign: 'center',
                        }}>
                          <div style={{
                            width: 52,
                            height: 52,
                            borderRadius: 16,
                            background: 'rgba(196,98,58,0.1)',
                            border: '1.5px solid rgba(196,98,58,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 14px',
                            color: '#C4623A',
                          }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <path d="M3 9h18"/>
                              <path d="M3 15h18"/>
                              <path d="M9 3v18"/>
                              <path d="M15 3v18"/>
                            </svg>
                          </div>
                          <div style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#E88C2A',
                            marginBottom: 6,
                          }}>
                            Total Room Area
                          </div>
                          <div style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: 54,
                            fontWeight: 700,
                            color: '#2C1810',
                            lineHeight: 1,
                            marginBottom: 4,
                          }}>
                            {(parseFloat(length) * parseFloat(width)).toFixed(1)}
                          </div>
                          <div style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            color: '#8B6A5A',
                            marginBottom: 12,
                          }}>
                            sq {measurementUnit === 'feet' ? 'ft' : 'm²'}
                          </div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: '#8B3A2A',
                            background: 'rgba(139,58,42,0.06)',
                            border: '1px solid rgba(139,58,42,0.15)',
                            borderRadius: 999,
                            padding: '5px 14px',
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            Heated area is typically 70–80% of total room area
                          </div>
                        </div>
                      )}

                      {length && width && parseFloat(length) > 0 && parseFloat(width) > 0 && (
                        <button
                          onClick={() => goToStep(5)}
                          style={{
                            marginTop: 20,
                            width: '100%',
                            background: 'linear-gradient(135deg, #C4623A, #E88C2A)',
                            color: '#fff',
                            fontFamily: "var(--font-body)",
                            fontSize: 15,
                            fontWeight: 600,
                            padding: '16px',
                            borderRadius: 16,
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(196,98,58,0.35)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            letterSpacing: '0.02em',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 32px rgba(196,98,58,0.45)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(196,98,58,0.35)';
                          }}
                        >
                          Continue →
                        </button>
                      )}
                    </div>

                    <p style={{
                      marginTop: 16,
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: '#8B6A5A',
                      textAlign: 'center',
                      opacity: 0.75,
                    }}>
                      Measure wall-to-wall for the most accurate results.
                    </p>
                  </div>
                )}

                {/* ── STEP 5: Heated Area ── */}
                {step === 5 && (
                  <div style={{
                    minHeight: 'calc(100vh - 52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                  }}>
                    <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
                      <h1 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 'clamp(28px, 5vw, 46px)',
                        fontWeight: 700,
                        color: '#2C1810',
                        lineHeight: 1.15,
                        margin: '0 0 14px',
                      }}>
                        How much of your room will be heated?
                      </h1>
                     
                    </div>

                    <div style={{
                      width: '100%',
                      maxWidth: 500,
                      background: 'rgba(255,255,255,0.82)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      borderRadius: 28,
                      boxShadow: '0 8px 40px rgba(60,42,37,0.09)',
                      padding: '36px 32px 32px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#6B4A2D',
                          background: 'rgba(196,98,58,0.08)',
                          border: '1px solid rgba(196,98,58,0.2)',
                          borderRadius: 999,
                          padding: '8px 18px',
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4623A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
                          </svg>
                          Total room area: <strong style={{ color: '#C4623A' }}>{totalArea} {unitLabel}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: 18,
                          background: 'rgba(196,98,58,0.1)',
                          border: '1.5px solid rgba(196,98,58,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          color: '#C4623A',
                        }}>
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2C6.5 2 3 6 3 10c0 6 9 12 9 12s9-6 9-12c0-4-3.5-8-9-8z"/>
                            <circle cx="12" cy="10" r="2.5"/>
                          </svg>
                        </div>
                        <div style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: 64,
                          fontWeight: 700,
                          color: '#C4623A',
                          lineHeight: 1,
                          marginBottom: 4,
                        }}>
                          {heatedArea}
                        </div>
                        <div style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: '#8B6A5A',
                          marginBottom: 4,
                        }}>
                          {unitLabel} heated
                        </div>
                        <div style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#C4623A',
                        }}>
                          {heatedPercent}% coverage
                        </div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={heatedPercent}
                          onChange={e => setHeatedPercent(Number(e.target.value))}
                          className="premium-slider"
                          style={{
                            width: '100%',
                            background: `linear-gradient(to right, #C4623A 0%, #E88C2A ${heatedPercent}%, rgba(196,98,58,0.15) ${heatedPercent}%, rgba(196,98,58,0.15) 100%)`,
                          }}
                        />
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: '#8B6A5A',
                          marginTop: 8,
                        }}>
                          <span>10%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div style={{
                        textAlign: 'center',
                        marginBottom: 24,
                        minHeight: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {heatedPercent >= 70 && heatedPercent <= 80 ? (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                            color: '#6BAE7F', background: 'rgba(107,174,127,0.1)',
                            border: '1px solid rgba(107,174,127,0.3)', borderRadius: 999, padding: '7px 16px',
                          }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Recommended coverage for comfort and efficiency
                          </div>
                        ) : heatedPercent < 70 ? (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontFamily: "var(--font-body)", fontSize: 12,
                            color: '#E88C2A', background: 'rgba(232,140,42,0.08)',
                            border: '1px solid rgba(232,140,42,0.25)', borderRadius: 999, padding: '7px 16px',
                          }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            Consider increasing for better warmth distribution
                          </div>
                        ) : (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontFamily: "var(--font-body)", fontSize: 12,
                            color: '#4FA3D1', background: 'rgba(79,163,209,0.08)',
                            border: '1px solid rgba(79,163,209,0.25)', borderRadius: 999, padding: '7px 16px',
                          }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Full coverage, ideal for open-plan spaces
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => goToStep(6)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #C4623A, #E88C2A)',
                          color: '#fff',
                          fontFamily: "var(--font-body)",
                          fontSize: 15,
                          fontWeight: 600,
                          padding: '16px',
                          borderRadius: 16,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 24px rgba(196,98,58,0.35)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(196,98,58,0.45)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(196,98,58,0.35)';
                        }}
                      >
                        Continue →
                      </button>
                    </div>

                    <p style={{
                      marginTop: 16,
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: '#8B6A5A',
                      textAlign: 'center',
                      opacity: 0.75,
                    }}>
                      You can always adjust this later when finalising your quote.
                    </p>
                  </div>
                )}

                {/* ── STEP 6: Thermostat ── */}
                {step === 6 && (
                  <div style={{
                    minHeight: 'calc(100vh - 52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                  }}>
                    <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
                      <h1 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 'clamp(28px, 5vw, 46px)',
                        fontWeight: 700,
                        color: '#2C1810',
                        lineHeight: 1.15,
                        margin: '0 0 14px',
                      }}>
                        Select a thermostat
                      </h1>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: '#6B4A2D',
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        Choose the thermostat that best suits your needs, lifestyle and budget.
                      </p>
                    </div>

                    <div className="thermostat-grid">
                      {[
                        {
                          id: 'standard',
                          label: 'Standard Thermostat',
                          sublabel: 'Manual dial control',
                          description: 'Simple to use, reliable and cost-effective. Basic on/off scheduling.',
                          chip: 'Most Popular',
                          chipColor: '#C4623A',
                          color: '#C4623A',
                          image: '/images/s.png',
                        },
                        {
                          id: 'modular',
                          label: 'Modular Thermostat',
                          sublabel: 'Programmable weekly schedule',
                          description: '7-day programming with multiple temperature periods. Fits standard electrical backboxes.',
                          chip: null,
                          chipColor: null,
                          color: '#4FA3D1',
                          image: '/images/m.png',
                        },
                        {
                          id: 'wifi',
                          label: 'WiFi Smart Thermostat',
                          sublabel: 'App + voice control',
                          description: 'Control from anywhere via smartphone. Compatible with Alexa, Google Home and Apple HomeKit.',
                          chip: 'Premium',
                          chipColor: '#6BAE7F',
                          color: '#6BAE7F',
                          image: '/images/w.png',
                        },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setThermostat(t.id)}
                          className="thermostat-card"
                          style={{
                            background: thermostat === t.id
                              ? 'rgba(255,255,255,0.97)'
                              : 'rgba(255,255,255,0.72)',
                            backdropFilter: 'blur(28px)',
                            WebkitBackdropFilter: 'blur(28px)',
                            border: thermostat === t.id
                              ? `2px solid ${t.color}`
                              : '1px solid rgba(255,255,255,0.5)',
                            borderRadius: 22,
                            boxShadow: thermostat === t.id
                              ? `0 0 0 4px ${t.color}18, 0 20px 60px rgba(60,42,37,0.12)`
                              : '0 8px 32px rgba(60,42,37,0.07)',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            position: 'relative',
                            padding: '0 0 28px 0',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            overflow: 'hidden',
                            gap: 0,
                          }}
                        >
                          {/* Chip badge */}
                          {t.chip && (
                            <div style={{
                              position: 'absolute',
                              top: 14,
                              right: 14,
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#fff',
                              background: t.chipColor,
                              borderRadius: 999,
                              padding: '4px 12px',
                              zIndex: 2,
                              boxShadow: `0 2px 8px ${t.chipColor}50`,
                            }}>
                              {t.chip}
                            </div>
                          )}

                          {/* Product image */}
                          <div style={{
                            width: '100%',
                            height: 180,
                            overflow: 'hidden',
                            borderRadius: '20px 20px 0 0',
                            position: 'relative',
                            background: `${t.color}10`,
                          }}>
                            <Image
                              src={t.image}
                              alt={t.label}
                              fill
                              loading="lazy"
                              sizes="(max-width: 640px) 90vw, 340px"
                              quality={72}
                              style={{
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease',
                                transform: thermostat === t.id ? 'scale(1.05)' : 'scale(1)',
                              }}
                              onError={e => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.background = `${t.color}15`;
                              }}
                            />
                            {/* Gradient overlay */}
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 60,
                              background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)',
                            }}/>
                          </div>

                          {/* Content */}
                          <div style={{ padding: '20px 24px 0', width: '100%', boxSizing: 'border-box' }}>
                            {/* Label */}
                            <div style={{
                              fontFamily: "var(--font-heading)",
                              fontSize: 22,
                              fontWeight: 600,
                              color: thermostat === t.id ? t.color : '#2C1810',
                              marginBottom: 6,
                              transition: 'color 0.2s ease',
                            }}>
                              {t.label}
                            </div>

                            {/* Sublabel */}
                            <div style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12,
                              fontWeight: 600,
                              color: t.color,
                              marginBottom: 10,
                              letterSpacing: '0.03em',
                            }}>
                              {t.sublabel}
                            </div>

                            {/* Description */}
                            <div style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              color: '#6B4A2D',
                              lineHeight: 1.6,
                              marginBottom: 16,
                            }}>
                              {t.description}
                            </div>

                            {/* Color bar indicator */}
                            <div style={{
                              height: 3,
                              borderRadius: 999,
                              background: thermostat === t.id
                                ? `linear-gradient(90deg, ${t.color}, ${t.color}80)`
                                : 'rgba(196,98,58,0.1)',
                              transition: 'all 0.3s ease',
                              width: thermostat === t.id ? '100%' : '40%',
                              margin: '0 auto',
                            }}/>
                          </div>

                          {/* Selected checkmark */}
                          {thermostat === t.id && (
                            <div style={{
                              position: 'absolute',
                              top: 14,
                              left: 14,
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: t.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 2px 8px ${t.color}60`,
                              zIndex: 2,
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {thermostat && (
                      <button
                        onClick={() => goToStep(8)}
                        style={{
                          marginTop: 32,
                          background: 'linear-gradient(135deg, #C4623A, #E88C2A)',
                          color: '#fff',
                          fontFamily: "var(--font-body)",
                          fontSize: 15,
                          fontWeight: 600,
                          padding: '16px 48px',
                          borderRadius: 16,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 24px rgba(196,98,58,0.35)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(196,98,58,0.45)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(196,98,58,0.35)';
                        }}
                      >
                        Continue →
                      </button>
                    )}
                  </div>
                )}

                {/* ── STEP 7: Insulation ── */}
                {step === 7 && (
                  <div style={{
                    minHeight: 'calc(100vh - 52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                  }}>
                    <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
                      <h1 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 'clamp(28px, 5vw, 46px)',
                        fontWeight: 700,
                        color: '#2C1810',
                        lineHeight: 1.15,
                        margin: '0 0 14px',
                      }}>
                        Select insulation
                      </h1>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: '#6B4A2D',
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        Choose the insulation type that best suits your subfloor and heating needs.
                      </p>
                    </div>

                    <div className="insulation-grid">
                      {[
                        {
                          id: 'xple',
                          label: 'XPLE Insulation',
                          sublabel: 'Cross-linked polyethylene foam',
                          description: 'Flexible, lightweight and easy to install. Works under all floor types.',
                          chip: 'Most Popular',
                          chipColor: '#E88C2A',
                          color: '#E88C2A',
                        },
                        {
                          id: 'xps',
                          label: 'XPS Insulation',
                          sublabel: 'Extruded polystyrene rigid board',
                          description: 'Maximum thermal efficiency. Rigid boards ideal for concrete subfloors. Higher R-value than foam.',
                          chip: 'Premium',
                          chipColor: '#8B3A2A',
                          color: '#8B3A2A',
                        },
                      ].map(i => (
                        <button
                          key={i.id}
                          onClick={() => setInsulation(i.id)}
                          className="insulation-card"
                          style={{
                            background: insulation === i.id
                              ? 'rgba(255,255,255,0.97)'
                              : 'rgba(255,255,255,0.72)',
                            backdropFilter: 'blur(28px)',
                            WebkitBackdropFilter: 'blur(28px)',
                            border: insulation === i.id
                              ? `2px solid ${i.color}`
                              : '1px solid rgba(255,255,255,0.5)',
                            borderRadius: 22,
                            boxShadow: insulation === i.id
                              ? `0 0 0 4px ${i.color}18, 0 20px 60px rgba(60,42,37,0.12)`
                              : '0 8px 32px rgba(60,42,37,0.07)',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            position: 'relative',
                            padding: '32px 24px 28px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0,
                            width: '100%',
                          }}
                        >
                          {i.chip && (
                            <div style={{
                              position: 'absolute',
                              top: 14,
                              right: 14,
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#fff',
                              background: i.chipColor,
                              borderRadius: 999,
                              padding: '4px 12px',
                              zIndex: 2,
                              boxShadow: `0 2px 8px ${i.chipColor}50`,
                            }}>
                              {i.chip}
                            </div>
                          )}

                          <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: 20,
                            background: `${i.color}15`,
                            border: `1.5px solid ${i.color}35`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            color: i.color,
                            transition: 'all 0.25s ease',
                            transform: insulation === i.id ? 'scale(1.08)' : 'scale(1)',
                            boxShadow: insulation === i.id
                              ? `0 8px 24px ${i.color}30`
                              : 'none',
                          }}>
                            {insulationIcons[i.id]()}
                          </div>

                          <div style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: 22,
                            fontWeight: 600,
                            color: insulation === i.id ? i.color : '#2C1810',
                            marginBottom: 8,
                            transition: 'color 0.2s ease',
                          }}>
                            {i.label}
                          </div>

                          <div style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            color: '#6B4A2D',
                            lineHeight: 1.5,
                            marginBottom: 16,
                          }}>
                            {i.sublabel}
                          </div>

                          <div style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            color: '#6B4A2D',
                            lineHeight: 1.6,
                            marginBottom: 16,
                          }}>
                            {i.description}
                          </div>

                          <div style={{
                            height: 3,
                            borderRadius: 999,
                            background: insulation === i.id
                              ? `linear-gradient(90deg, ${i.color}, ${i.color}80)`
                              : 'rgba(196,98,58,0.1)',
                            transition: 'all 0.3s ease',
                            width: insulation === i.id ? '100%' : '40%',
                            margin: '0 auto',
                          }}/>

                          {insulation === i.id && (
                            <div style={{
                              position: 'absolute',
                              top: 14,
                              left: 14,
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: i.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 2px 8px ${i.color}60`,
                              zIndex: 2,
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {insulation && (
                      <button
                        onClick={() => goToStep(8)}
                        style={{
                          marginTop: 32,
                          background: 'linear-gradient(135deg, #C4623A, #E88C2A)',
                          color: '#fff',
                          fontFamily: "var(--font-body)",
                          fontSize: 15,
                          fontWeight: 600,
                          padding: '16px 48px',
                          borderRadius: 16,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 8px 24px rgba(196,98,58,0.35)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(196,98,58,0.45)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(196,98,58,0.35)';
                        }}
                      >
                        Continue →
                      </button>
                    )}
                  </div>
                )}

                {/* ── STEP 8: Review & Submit ── */}
                {step === 8 && (
                  <div style={{
                    minHeight: 'calc(100vh - 52px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                  }}>
                    <StepHeading>Review your details</StepHeading>
                    <StepSub>Everything looks good? Add your contact info and share your location for the site visit.</StepSub>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, alignItems: 'start' }}>
                      {/* ── LEFT: Summary ── */}
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        style={{ ...cardBase, padding: '28px 24px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#E88C2A', margin: 0 }}>
                            Your Configuration
                          </p>
                        </div>
                        <div style={{ height: 1, background: '#E8D5C0', margin: '12px 0 4px' }} />

                        {[
                          { icon: roomType ? roomIcons[roomType] : null, label: 'Room', value: roomType ? roomLabels[roomType] : ' ', color: roomType ? roomColors[roomType] : '#C4623A', step: 1 },
                          { icon: subfloor ? subfloorIcons[subfloor] : null, label: 'Subfloor', value: subfloor ? subfloorLabels[subfloor] : ' ', color: subfloor ? subfloorColors[subfloor] : '#C4623A', step: 2 },
                          { icon: floorSurface ? surfaceIcons[floorSurface] : null, label: 'Surface', value: floorSurface ? surfaceLabels[floorSurface] : ' ', color: floorSurface ? surfaceColors[floorSurface] : '#C4623A', step: 3 },
                          { icon: Icon.Ruler, label: 'Dimensions', value: length && width ? `${length} × ${width} ${measurementUnit === 'feet' ? 'ft' : 'm'}` : ' ', step: 4 },
                          { icon: Icon.Grid, label: 'Total Area', value: totalArea ? `${totalArea} ${unitLabel}` : ' ', step: 4 },
                          { icon: Icon.Zap, label: 'Heated Area', value: heatedArea ? `${heatedArea} ${unitLabel} (${heatedPercent}%)` : ' ', step: 5 },
                          { icon: thermostat ? thermostatIcons[thermostat] : null, label: 'Thermostat', value: thermostat ? thermostatLabels[thermostat] : ' ', color: thermostat ? thermostatColors[thermostat] : '#C4623A', step: 6 },
                          { icon: Icon.Insulation, label: 'Insulation', value: insulation ? `${insulation.toUpperCase()}, ${insulationThickness}` : ' ', step: 7 },
                        ].map((item) => (
                          <SummaryRow
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            value={item.value}
                            color={item.color}
                            onEdit={() => goToStep(item.step)}
                          />
                        ))}
                      </motion.div>

                      {/* ── RIGHT: Contact Form ── */}
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                        style={{ ...cardBase, padding: '28px 24px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#E88C2A', margin: 0 }}>
                            Your Details
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                          {/* Name */}
                          <div>
                            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: '#6B4A2D', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your full name"
                              className="glass-input"
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: '#6B4A2D', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 70060 00000"
                              className="glass-input"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: '#6B4A2D', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Email <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="yourname@email.com"
                              className="glass-input"
                            />
                          </div>

                          {/* Location */}
                          <div>
                            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: '#6B4A2D', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ color: '#C4623A' }}><Icon.Location /></span>
                                Your Location <span style={{ fontWeight: 400, opacity: 0.6 }}>(for site visit)</span>
                              </span>
                            </label>
                            <LocationPicker value={location} onChange={setLocation} />
                          </div>

                          {/* Message */}
                          <div>
                            <label style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: '#6B4A2D', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Message <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                            </label>
                            <textarea
                              rows={2}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Any specific requirements?"
                              className="glass-input"
                              style={{ resize: 'none', paddingTop: 11 }}
                            />
                          </div>

                          {/* Submit */}
                          <PrimaryButton
                            onClick={handleSubmit}
                            disabled={!name.trim() || !phone.trim()}
                            loading={submitting}
                          >
                            Submit Details →
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
