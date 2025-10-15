import React from 'react';
import { FaLanguage, FaBook, FaComments, FaUsers, FaGraduationCap, FaHeadphones, FaMicrophone, FaEnvelope, FaTrophy } from 'react-icons/fa';
import '../styles/english-speaking.css';

function EnglishSpeaking() {
  return (
    <main className="english-speaking-container">
      <div className="page-title">
        <h1>English Speaking Course</h1>
        <p>Master English fluency step by step with level-wise learning, from basic conversation to professional communication.</p>
      </div>

      {/* Level 1: Beginner */}
      <section className="level-section">
        <h2>Level 1: Beginner</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaLanguage /></span> Module 1: Fundamentals of English</h3>
            <ul>
              <li>English alphabet, pronunciation, and phonetics</li>
              <li>Basic greetings and self-introduction</li>
              <li>Numbers, dates, and common expressions</li>
              <li>Understanding vowels and consonants</li>
              <li>Basic spelling and word formation</li>
              <li>Introduction to syllables and stress</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaBook /></span> Module 2: Basic Grammar</h3>
            <ul>
              <li>Simple present, past, and future tense</li>
              <li>Basic sentence formation</li>
              <li>Common verbs, nouns, and adjectives usage</li>
              <li>Subject-verb agreement basics</li>
              <li>Question formation and negation</li>
              <li>Possessive forms and plurals</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaComments /></span> Module 3: Everyday Conversations</h3>
            <ul>
              <li>Introducing yourself and others</li>
              <li>Shopping, traveling, and basic social conversations</li>
              <li>Common questions and answers in daily life</li>
              <li>Asking for directions and help</li>
              <li>Expressing likes, dislikes, and preferences</li>
              <li>Basic polite phrases and etiquette</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Level 2: Intermediate */}
      <section className="level-section">
        <h2>Level 2: Intermediate</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaUsers /></span> Module 1: Conversational English</h3>
            <ul>
              <li>Role plays for social and professional scenarios</li>
              <li>Polite requests, opinions, and suggestions</li>
              <li>Expressing ideas clearly and confidently</li>
              <li>Handling small talk and icebreakers</li>
              <li>Describing people, places, and events</li>
              <li>Using modals for possibility and advice</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaGraduationCap /></span> Module 2: Advanced Grammar & Vocabulary</h3>
            <ul>
              <li>Complex sentences and clauses</li>
              <li>Common idioms, phrases, and collocations</li>
              <li>Synonyms, antonyms, and word usage practice</li>
              <li>Perfect tenses and conditionals</li>
              <li>Passive voice and reported speech</li>
              <li>Expanding vocabulary through context</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaHeadphones /></span> Module 3: Listening & Pronunciation Skills</h3>
            <ul>
              <li>Understanding native speakers</li>
              <li>Correcting common pronunciation mistakes</li>
              <li>Shadowing and repetition exercises</li>
              <li>Intonation and rhythm in speech</li>
              <li>Listening to podcasts and news</li>
              <li>Phonetic transcription practice</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Level 3: Advanced */}
      <section className="level-section">
        <h2>Level 3: Advanced</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaMicrophone /></span> Module 1: Public Speaking & Presentation</h3>
            <ul>
              <li>Structured speech and presentation skills</li>
              <li>Handling audience questions and feedback</li>
              <li>Storytelling and persuasive communication</li>
              <li>Body language and eye contact</li>
              <li>Using visual aids effectively</li>
              <li>Overcoming stage fright</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaEnvelope /></span> Module 2: Professional English</h3>
            <ul>
              <li>Business emails and formal communication</li>
              <li>Telephonic and video call etiquette</li>
              <li>Resume writing and interview practice</li>
              <li>Meeting and negotiation skills</li>
              <li>Writing reports and proposals</li>
              <li>Cross-cultural communication</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaTrophy /></span> Module 3: Fluency & Confidence Enhancement</h3>
            <ul>
              <li>Debate and group discussion exercises</li>
              <li>Advanced idioms, expressions, and phrasal verbs</li>
              <li>Daily speaking challenges to build confidence</li>
              <li>Impromptu speaking practice</li>
              <li>Recording and self-assessment</li>
              <li>Building a personal vocabulary journal</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EnglishSpeaking;
