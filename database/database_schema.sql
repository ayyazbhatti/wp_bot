--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_users_currentState; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_users_currentState" AS ENUM (
    'welcome',
    'waiting_for_yes',
    'waiting_for_name',
    'waiting_for_email',
    'completed'
);


ALTER TYPE public."enum_users_currentState" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    whatsapp_id character varying(255) NOT NULL,
    phone_number character varying(50),
    name character varying(255),
    email character varying(255),
    state character varying(50) DEFAULT 'initial'::character varying,
    first_message text,
    last_message text,
    message_count integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO postgres;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    contact_id integer,
    whatsapp_id character varying(255),
    message_text text,
    is_from_user boolean DEFAULT true,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "chatId" character varying(255) NOT NULL,
    "whatsappName" character varying(255),
    "fullName" character varying(255),
    email character varying(255),
    "registrationComplete" boolean DEFAULT false,
    "autoLoginUrl" text,
    "currentState" public."enum_users_currentState" DEFAULT 'welcome'::public."enum_users_currentState",
    "lastActivity" timestamp with time zone,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: COLUMN users."chatId"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."chatId" IS 'WhatsApp chat ID';


--
-- Name: COLUMN users."whatsappName"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."whatsappName" IS 'WhatsApp profile name';


--
-- Name: COLUMN users."fullName"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."fullName" IS 'User full name';


--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.email IS 'User email address';


--
-- Name: COLUMN users."registrationComplete"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."registrationComplete" IS 'Whether registration is complete';


--
-- Name: COLUMN users."autoLoginUrl"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."autoLoginUrl" IS 'Auto-login URL from trading platform';


--
-- Name: COLUMN users."currentState"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."currentState" IS 'Current conversation state';


--
-- Name: COLUMN users."lastActivity"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."lastActivity" IS 'Last user activity timestamp';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_whatsapp_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_whatsapp_id_key UNIQUE (whatsapp_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_chatId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_chatId_key" UNIQUE ("chatId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_contacts_whatsapp_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contacts_whatsapp_id ON public.contacts USING btree (whatsapp_id);


--
-- Name: idx_messages_contact_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_contact_id ON public.messages USING btree (contact_id);


--
-- Name: users_chat_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_chat_id ON public.users USING btree ("chatId");


--
-- Name: users_current_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_current_state ON public.users USING btree ("currentState");


--
-- Name: users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email ON public.users USING btree (email);


--
-- Name: users_last_activity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_last_activity ON public.users USING btree ("lastActivity");


--
-- Name: messages messages_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

