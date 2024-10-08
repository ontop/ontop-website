PGDMP     :    !                y            uni2    13.2    13.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    uni2    DATABASE     O   CREATE DATABASE uni2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE uni2;
                postgres    false            �            1259    16405    course    TABLE     �   CREATE TABLE public.course (
    cid integer NOT NULL,
    lecturer integer NOT NULL,
    lab_teacher integer NOT NULL,
    topic character varying(100) NOT NULL
);
    DROP TABLE public.course;
       public         heap    postgres    false            �            1259    16399    person    TABLE     �   CREATE TABLE public.person (
    pid integer NOT NULL,
    fname character varying(40) NOT NULL,
    lname character varying(40) NOT NULL,
    status integer NOT NULL
);
    DROP TABLE public.person;
       public         heap    postgres    false            �            1259    16412    registration    TABLE     Y   CREATE TABLE public.registration (
    pid integer NOT NULL,
    cid integer NOT NULL
);
     DROP TABLE public.registration;
       public         heap    postgres    false            �          0    16405    course 
   TABLE DATA           C   COPY public.course (cid, lecturer, lab_teacher, topic) FROM stdin;
    public          postgres    false    201   i       �          0    16399    person 
   TABLE DATA           ;   COPY public.person (pid, fname, lname, status) FROM stdin;
    public          postgres    false    200          �          0    16412    registration 
   TABLE DATA           0   COPY public.registration (pid, cid) FROM stdin;
    public          postgres    false    202   �       9           2606    16409    course course_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (cid);
 <   ALTER TABLE ONLY public.course DROP CONSTRAINT course_pkey;
       public            postgres    false    201            4           2606    16403    person person_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (pid);
 <   ALTER TABLE ONLY public.person DROP CONSTRAINT person_pkey;
       public            postgres    false    200            6           1259    16411    course_lab_teacher_idx    INDEX     P   CREATE INDEX course_lab_teacher_idx ON public.course USING btree (lab_teacher);
 *   DROP INDEX public.course_lab_teacher_idx;
       public            postgres    false    201            7           1259    16410    course_lecturer_idx    INDEX     J   CREATE INDEX course_lecturer_idx ON public.course USING btree (lecturer);
 '   DROP INDEX public.course_lecturer_idx;
       public            postgres    false    201            5           1259    16404    person_status_idx    INDEX     F   CREATE INDEX person_status_idx ON public.person USING btree (status);
 %   DROP INDEX public.person_status_idx;
       public            postgres    false    200            :           1259    16416    registration_cid_idx    INDEX     L   CREATE INDEX registration_cid_idx ON public.registration USING btree (cid);
 (   DROP INDEX public.registration_cid_idx;
       public            postgres    false    202            ;           1259    16415    registration_pid_idx    INDEX     L   CREATE INDEX registration_pid_idx ON public.registration USING btree (pid);
 (   DROP INDEX public.registration_pid_idx;
       public            postgres    false    202            =           2606    16422    course course_lab_teacher_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_lab_teacher_fkey FOREIGN KEY (lab_teacher) REFERENCES public.person(pid);
 H   ALTER TABLE ONLY public.course DROP CONSTRAINT course_lab_teacher_fkey;
       public          postgres    false    200    201    3124            <           2606    16417    course course_lecturer_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_lecturer_fkey FOREIGN KEY (lecturer) REFERENCES public.person(pid);
 E   ALTER TABLE ONLY public.course DROP CONSTRAINT course_lecturer_fkey;
       public          postgres    false    3124    201    200            ?           2606    16432 "   registration registration_cid_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.registration
    ADD CONSTRAINT registration_cid_fkey FOREIGN KEY (cid) REFERENCES public.course(cid);
 L   ALTER TABLE ONLY public.registration DROP CONSTRAINT registration_cid_fkey;
       public          postgres    false    202    3129    201            >           2606    16427 "   registration registration_pid_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.registration
    ADD CONSTRAINT registration_pid_fkey FOREIGN KEY (pid) REFERENCES public.person(pid);
 L   ALTER TABLE ONLY public.registration DROP CONSTRAINT registration_pid_fkey;
       public          postgres    false    3124    202    200            �   �   x�=�1�0��>EN�T�B�Y���D�"51�]�ܞ������:��QV��-qqJa�d�0�3���Bn��X*�pm���-H�e_|�L�ph�[3Mx��5>�Q|ΩD����AȨu�E�|P���6�)�1��ж��`7W5ʊ�"~�<+      �   �   x��K
�@D�Շ�_�R](j6�M;8���d�<��]W�{�p�;�%�Pq�^P�N:8c������p�7F4����(N����}I`k��cL3}�cB�ĜQP���u�|��`��S8����3�ҫ���pW�M�v�\h�)�簍7�G�	]D�)�6�      �   $   x�3�4�24�4�2�4�0�9��ؘ�H��qqq O�X     