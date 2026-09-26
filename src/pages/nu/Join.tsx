import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import InfoCard from '../../components/InfoCard';
import WhyJoin from '../../components/WhyJoin';
import BinaryHeartText from '../../components/BinaryHeartText';
import { BRAND_COLORS, NORTHWESTERN_COLORS } from '../../utils/brandColors';
import { firstMeeting, isFirstMeetingUpcoming } from './firstMeeting';

// Mailing list Google Form (owned by nu@binaryheart.org). The form rejects
// non-Northwestern emails, and its Apps Script copies each signup to the
// chapter's mailing list Sheet and sends a confirmation email.
const MAILING_LIST_FORM = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc8t1MkudzsETj5OBLcX0DgLpy1PN-ukz43wciA2C-Cohsf5Q/formResponse',
  fieldIds: { email: 'entry.649490301', source: 'entry.486317671' },
};
const NU_EMAIL = /^[a-z0-9._%+'-]+@(u\.)?northwestern\.edu$/;
const MAILING_LIST_STORAGE_KEY = 'nuMailingListEmail';
const CATS_ON_CAMPUS_URL = 'https://catsoncampus.northwestern.edu/binaryheart/club_signup';
const DISCORD_URL = 'https://discord.gg/66ccvwV7J'; // national BinaryHeart server

export default function Join() {
  const showFirstMeeting = isFirstMeetingUpcoming();

  return (
    <main className="grow relative z-10">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 sm:pb-16 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
              Join <BinaryHeartText /> at Northwestern
            </h1>
            <p className="text-lg sm:text-xl leading-7 sm:leading-8 text-gray-700">
              Be part of a community making technology accessible while gaining valuable hands-on experience.
            </p>
          </div>
        </div>
      </div>

      {/* First Meeting - shown until the day after the meeting */}
      {showFirstMeeting && (
        <div id="first-meeting" className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-2xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 lg:p-12 shadow-xl ring-1 ring-gray-900/5">
              <div className="text-center mb-8">
                <span className={`inline-block rounded-full ${NORTHWESTERN_COLORS.BG_LIGHT} px-3 py-1 text-xs font-semibold uppercase tracking-wide ${NORTHWESTERN_COLORS.TEXT} mb-4`}>
                  {firstMeeting.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{firstMeeting.subtitle}</h2>
                <p className="text-base sm:text-lg text-gray-600">
                  Join <BinaryHeartText className="font-bold" binaryColor={BRAND_COLORS.BINARY_TEXT} heartColor={BRAND_COLORS.HEART_TEXT} /> at Northwestern for our first meeting of the 2026-2027 academic year. Open to all!
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-8">
                <div className={`flex items-start gap-4 rounded-xl ${NORTHWESTERN_COLORS.BG_50} p-4 sm:p-6`}>
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl ${NORTHWESTERN_COLORS.BG_LIGHT}`}>
                    <svg className={`h-5 w-5 sm:h-6 sm:w-6 ${NORTHWESTERN_COLORS.TEXT}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Date & Time</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{firstMeeting.displayDate}</p>
                    <p className="text-sm sm:text-base text-gray-600">{firstMeeting.time}</p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 rounded-xl ${NORTHWESTERN_COLORS.BG_50} p-4 sm:p-6`}>
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl ${NORTHWESTERN_COLORS.BG_LIGHT}`}>
                    <svg className={`h-5 w-5 sm:h-6 sm:w-6 ${NORTHWESTERN_COLORS.TEXT}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{firstMeeting.locationName}</p>
                    <a
                      href={firstMeeting.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm sm:text-base ${NORTHWESTERN_COLORS.TEXT} ${NORTHWESTERN_COLORS.TEXT_HOVER} underline`}
                    >
                      {firstMeeting.address}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-sm sm:text-base text-gray-600">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">What We'll Cover</h3>
                  <p>{firstMeeting.description}</p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Getting There</h3>
                  <p className="mb-3">
                    Our space is on Orrington Avenue, directly across from the Foster-Walker Complex, at the house with the front screened porch (to the right of the blue house, or two houses to the right of the apartment building on the corner of Orrington and Emerson). To get to our space:
                  </p>
                  <ol className="list-decimal space-y-1 pl-5 mb-3">
                    <li>Go to the front of the house.</li>
                    <li>Take the pathway that runs along the right side of the house.</li>
                    <li>Enter the side door and take the stairs to your right and you'll be in the space. Someone from exec will welcome you and help get you onboarded!</li>
                  </ol>
                  <p>
                    We will monitor our Instagram and email throughout all meetings, so don't hesitate to reach out through either channel if you have any trouble finding us. We are here to help!
                  </p>
                </div>

                <div className={`rounded-xl bg-gradient-to-br ${NORTHWESTERN_COLORS.GRADIENT_LIGHT} p-4 sm:p-6 text-center`}>
                  <p className="text-gray-900 font-semibold mb-1">
                    Drop in anytime between {firstMeeting.dropInWindow} on {firstMeeting.displayDate}.
                  </p>
                  <p className="mb-4">No experience necessary. We'll teach you everything you need to know!</p>
                  <div className="mx-auto grid max-w-lg grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="#mailing-list"
                      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${BRAND_COLORS.BINARY_GRADIENT} px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all duration-200`}
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                      Join our mailing list
                    </a>
                    <a
                      href={CATS_ON_CAMPUS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${NORTHWESTERN_COLORS.GRADIENT_PRIMARY} px-5 py-2.5 text-sm font-semibold text-white shadow-md ${NORTHWESTERN_COLORS.GRADIENT_PRIMARY_HOVER} transition-all duration-200`}
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                      Join on Cats on Campus
                    </a>
                    <a
                      href={`mailto:${firstMeeting.email}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-gray-900/10 hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      Email {firstMeeting.email}
                    </a>
                    <a
                      href={`https://instagram.com/${firstMeeting.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-gray-900/10 hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg className="h-5 w-5 shrink-0 text-[#dd2a7b]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      DM @{firstMeeting.instagram}
                    </a>
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#4752C4] transition-all duration-200"
                    >
                      <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                      Join BinaryHeart's Discord
                    </a>
                  </div>
                  <p className="mt-4 text-gray-900 font-medium">We're looking forward to seeing everyone!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Information - Prominent Section */}
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className={`relative rounded-2xl bg-gradient-to-br ${NORTHWESTERN_COLORS.GRADIENT_PRIMARY_90} backdrop-blur-sm p-6 sm:p-8 lg:p-12 shadow-xl text-white`}>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Weekly Meetings</h2>
                <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6">
                  Drop-in repair sessions, device testing, and donation preparation
                </p>
              </div>
              
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-6 sm:mb-8">
                <div className="flex flex-col items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 sm:p-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-bold mb-1">Fall 2026 Schedule TBA</p>
                    <p className="text-sm sm:text-base text-white/90">Set based on the availability of interested members, will be announced Sunday, October 11th</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-bold mb-1">BinaryHeart Space</p>
                    <a 
                      href="https://maps.app.goo.gl/7UAMTC36M6UMPhax6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-white/90 hover:text-white underline"
                    >
                      1910 Orrington Ave, Evanston
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm sm:text-base text-white/90 mb-4">
                  <strong>All skill levels welcome!</strong> No experience necessary—we'll teach you everything you need to know.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Can Join */}
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl mb-6 text-center">
              Everyone Is Welcome
            </h2>
            <div className="text-gray-600 space-y-4 text-sm sm:text-base">
              <p>
                BinaryHeart at Northwestern is open to <strong>all students</strong>, regardless of major, year, or technical experience. Whether you're a CS major or studying humanities, there's a place for you here.
              </p>
              <p>
                We welcome students from all backgrounds and experience levels—from complete beginners to tech enthusiasts. Our team includes engineers, designers, business students, and students from every school at Northwestern, all united by a shared commitment to making technology accessible.
              </p>
              <p>
                <strong>No prior experience required.</strong> We'll teach you everything you need to know about computer refurbishment, software installation, and hardware troubleshooting. All you need is enthusiasm and a willingness to learn!
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhyJoin communityName="Evanston and Chicago" />

      {/* What to Expect */}
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">What to Expect</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Hands-on learning through practical workshops
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <InfoCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
              }
              title="Computer Repair & Refurbishment"
              description="Learn to diagnose issues, repair hardware, upgrade components, and restore devices to like-new condition."
              bgColorClass="bg-purple-100"
              iconColorClass="text-purple-600"
            />

            <InfoCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              }
              title="Hardware & Troubleshooting"
              description="Gain hands-on experience with hardware components, system diagnostics, and troubleshooting techniques."
              bgColorClass="bg-blue-100"
              iconColorClass="text-blue-600"
            />

            <InfoCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              }
              title="Software Installation & Optimization"
              description="Install operating systems, configure security settings, and optimize devices for end users."
              bgColorClass="bg-emerald-100"
              iconColorClass="text-emerald-600"
            />

            <InfoCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
              title="Device Testing & Quality Assurance"
              description="Test refurbished devices to ensure they meet quality standards before distribution to recipients."
              bgColorClass="bg-rose-100"
              iconColorClass="text-rose-600"
            />

            <InfoCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              }
              title="Donation Preparation"
              description="Prepare devices for distribution and participate in the rewarding process of connecting recipients with technology."
              bgColorClass="bg-amber-100"
              iconColorClass="text-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Get Connected Section */}
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Ready to Get Involved?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mt-4">
                Drop in anytime during our open hours—no RSVP needed!
              </p>
            </div>

            <div className="space-y-6">
              {/* Mailing List Signup */}
              <div id="mailing-list" className={`relative rounded-2xl bg-gradient-to-br ${BRAND_COLORS.BINARY_GRADIENT} backdrop-blur-sm p-6 sm:p-8 shadow-xl text-white`}>
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                      Join Our Mailing List
                    </h3>
                    <p className="text-white/90 mb-6 text-sm sm:text-base">
                      Get meeting and event updates in your inbox.
                    </p>
                    <MailingListForm />
                  </div>
                </div>
              </div>

              {/* Cats on Campus Card */}
              <div className={`relative rounded-2xl bg-gradient-to-br ${NORTHWESTERN_COLORS.GRADIENT_PRIMARY} p-6 sm:p-8 shadow-xl text-white`}>
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                      Join Us on Cats on Campus
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 mb-6">
                      Become an official member through Cats on Campus, Northwestern's student organization directory.
                    </p>
                    <a
                      href={CATS_ON_CAMPUS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <span>Join on Cats on Campus</span>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Discord Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#6c77f5] to-[#4752C4] p-6 sm:p-8 shadow-xl text-white">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                      Join Our Discord Server
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 mb-6">
                      Chat with members from every BinaryHeart chapter, ask questions, and stay up-to-date with our latest projects and events.
                    </p>
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-[#4752C4] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <span>Join Discord Server</span>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Instagram Follow */}
              <div className={`relative rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] backdrop-blur-sm p-6 sm:p-8 shadow-xl text-white`}>
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                      Follow Us on Instagram
                    </h3>
                    <p className="text-white/90 mb-6 text-sm sm:text-base">
                      Stay updated with weekly schedules, behind-the-scenes content, and any last-minute changes. Connect with the community and see our impact in action!
                    </p>
                    <a
                      href="https://instagram.com/binaryheartatnu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-[#c13584] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <span>@binaryheartatnu</span>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Contact */}
              <div className={`relative rounded-2xl bg-gradient-to-br ${NORTHWESTERN_COLORS.GRADIENT_SECONDARY} backdrop-blur-sm p-6 sm:p-8 shadow-xl text-white`}>
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">Have Questions?</h3>
                  <p className="text-sm sm:text-base text-white/90 mb-6">
                    Reach out to our team anytime—we're here to help!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <a
                      href="mailto:nu@binaryheart.org"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <span>nu@binaryheart.org</span>
                    </a>
                    <Link
                      to="/nu/about"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <span>Meet Our Team</span>
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                    <Link
                      to="/faq"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <span>View FAQ</span>
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function normalizeEmail(raw: string) {
  const email = raw.trim().toLowerCase().replace(/^mailto:/, '').replace(/\s+/g, '');
  return email && !email.includes('@') ? `${email}@u.northwestern.edu` : email;
}

function readSavedEmail() {
  try {
    return localStorage.getItem(MAILING_LIST_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function MailingListForm() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'failed'>(() => (readSavedEmail() ? 'done' : 'idle'));
  const [email, setEmail] = useState(readSavedEmail);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = normalizeEmail(input);
    if (!NU_EMAIL.test(normalized)) {
      setError('Please use your @u.northwestern.edu email. We need it to add you to Cats on Campus.');
      return;
    }
    setError('');
    setEmail(normalized);
    setStatus('submitting');
    const source = (searchParams.get('src') ?? 'website').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'website';
    try {
      // Google Forms doesn't allow reading the response cross-origin, so a
      // completed request counts as success; only network errors fail.
      await fetch(MAILING_LIST_FORM.formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          [MAILING_LIST_FORM.fieldIds.email]: normalized,
          [MAILING_LIST_FORM.fieldIds.source]: source,
        }).toString(),
      });
      try {
        localStorage.setItem(MAILING_LIST_STORAGE_KEY, normalized);
      } catch {
        // Private browsing: nothing to remember.
      }
      setStatus('done');
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-xl bg-white/15 p-4 ring-1 ring-white/30">
        <p className="font-semibold">You're on the list!</p>
        <p className="text-sm text-white/90 mt-1">
          We'll send updates to <span className="font-medium break-all">{email}</span>. Check your inbox for a confirmation.
        </p>
        <button
          type="button"
          onClick={() => {
            setInput('');
            setStatus('idle');
          }}
          className="mt-2 text-sm font-medium underline underline-offset-2 text-white/90 hover:text-white"
        >
          Sign up a different email
        </button>
      </div>
    );
  }

  if (status === 'failed') {
    const subject = encodeURIComponent('Join the BinaryHeart NU mailing list');
    const body = encodeURIComponent(`Hi BinaryHeart! Please add me to the Northwestern chapter mailing list: ${email}`);
    return (
      <div className="rounded-xl bg-white/15 p-4 ring-1 ring-white/30">
        <p className="font-semibold">We couldn't save your signup.</p>
        <p className="text-sm text-white/90 mt-1 mb-3">Send us a quick email instead and we'll add you.</p>
        <a
          href={`mailto:nu@binaryheart.org?subject=${subject}&body=${body}`}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg"
        >
          Join by email
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="mailing-list-email" className="block text-sm font-semibold mb-2">
        Northwestern email
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 min-w-0 items-center rounded-xl bg-white text-gray-900 shadow-lg focus-within:ring-2 focus-within:ring-white">
          <input
            id="mailing-list-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="go"
            size={1}
            placeholder="firstlast2029"
            value={input}
            onChange={e => {
              setInput(e.target.value);
              setError('');
            }}
            className="w-0 min-w-0 flex-1 bg-transparent pl-4 pr-1 py-3 text-base outline-none placeholder:text-gray-400"
          />
          {!input.includes('@') && (
            <span className="shrink-0 pr-4 text-sm sm:text-base text-gray-500 whitespace-nowrap">@u.northwestern.edu</span>
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gray-800 disabled:opacity-70"
        >
          {status === 'submitting' ? 'Joining…' : 'Join'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-white" role="alert">{error}</p>}
    </form>
  );
}
