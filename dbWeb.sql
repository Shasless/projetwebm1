PGDMP                     
    y            projet_web_M1    13.4    13.4     ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    16395    projet_web_M1    DATABASE     k   CREATE DATABASE "projet_web_M1" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'French_France.1252';
    DROP DATABASE "projet_web_M1";
                postgres    false            ?            1259    16396    articles    TABLE     ?   CREATE TABLE public.articles (
    id integer NOT NULL,
    owner integer NOT NULL,
    title text,
    content text,
    cover text,
    article_link text,
    game integer,
    price integer
);
    DROP TABLE public.articles;
       public         heap    postgres    false            ?            1259    16402    articles_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.articles_id_seq;
       public          postgres    false    200            ?           0    0    articles_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;
          public          postgres    false    201            ?            1259    16442    basket    TABLE     r   CREATE TABLE public.basket (
    id_article integer NOT NULL,
    id_user integer NOT NULL,
    number integer
);
    DROP TABLE public.basket;
       public         heap    postgres    false            ?            1259    16404    games    TABLE     ]   CREATE TABLE public.games (
    id integer NOT NULL,
    name text,
    display_name text
);
    DROP TABLE public.games;
       public         heap    postgres    false            ?            1259    16410    games_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.games_id_seq;
       public          postgres    false    202            ?           0    0    games_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;
          public          postgres    false    203            ?            1259    16412    users    TABLE     ?   CREATE TABLE public.users (
    id integer NOT NULL,
    email text,
    password text,
    admin boolean,
    username text,
    revendeur boolean
);
    DROP TABLE public.users;
       public         heap    postgres    false            ?            1259    16418    users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    204            ?           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    205            5           2604    16420    articles id    DEFAULT     j   ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);
 :   ALTER TABLE public.articles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    201    200            6           2604    16421    games id    DEFAULT     d   ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);
 7   ALTER TABLE public.games ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    202            7           2604    16422    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204            ?          0    16396    articles 
   TABLE DATA           _   COPY public.articles (id, owner, title, content, cover, article_link, game, price) FROM stdin;
    public          postgres    false    200           ?          0    16442    basket 
   TABLE DATA           =   COPY public.basket (id_article, id_user, number) FROM stdin;
    public          postgres    false    206   ?1       ?          0    16404    games 
   TABLE DATA           7   COPY public.games (id, name, display_name) FROM stdin;
    public          postgres    false    202   ?1       ?          0    16412    users 
   TABLE DATA           P   COPY public.users (id, email, password, admin, username, revendeur) FROM stdin;
    public          postgres    false    204   ?4       ?           0    0    articles_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.articles_id_seq', 85, true);
          public          postgres    false    201            ?           0    0    games_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.games_id_seq', 40, true);
          public          postgres    false    203            ?           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 8, true);
          public          postgres    false    205            9           2606    16426    articles articles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.articles DROP CONSTRAINT articles_pkey;
       public            postgres    false    200            @           2606    24588    basket basket_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.basket
    ADD CONSTRAINT basket_pkey PRIMARY KEY (id_article, id_user);
 <   ALTER TABLE ONLY public.basket DROP CONSTRAINT basket_pkey;
       public            postgres    false    206    206            <           2606    16428    games games_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.games DROP CONSTRAINT games_pkey;
       public            postgres    false    202            >           2606    16430    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    204            :           1259    16431    fki_game_references_games    INDEX     N   CREATE INDEX fki_game_references_games ON public.articles USING btree (game);
 -   DROP INDEX public.fki_game_references_games;
       public            postgres    false    200            A           2606    16432    articles articles_owner_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_owner_fkey FOREIGN KEY (owner) REFERENCES public.users(id);
 F   ALTER TABLE ONLY public.articles DROP CONSTRAINT articles_owner_fkey;
       public          postgres    false    200    204    2878            B           2606    16437    articles game_references_games    FK CONSTRAINT     ?   ALTER TABLE ONLY public.articles
    ADD CONSTRAINT game_references_games FOREIGN KEY (game) REFERENCES public.games(id) NOT VALID;
 H   ALTER TABLE ONLY public.articles DROP CONSTRAINT game_references_games;
       public          postgres    false    200    2876    202            ?      x??Z?n?Hr>SO?=??/"?d?XU??~Z?ӒZ#??g??d1UI&?I???40?>??Ş?}??÷??1O?/?%??3?? ^{1;*?????39?\????6???????	Ӱ?d7?e?K?4R?,?YU?]^????L??h?=v???????ϥ`??1??Y?KCkem?'?e?pY2}??Lqv-j???>5w???-ϥ`?<aX??Ĳ????P?=?uq?	!?WS?݂'?,???c?U}??a??ݿ?8?ݧ??I?f???L???f?e????]?\'?+?˻??J???$?Lk}?o?3???????T?ߊSCPѰZ$????}????~u?ɛ?2;??it-\Y??0?q??????]????*?E?A8??Q?A0???Q??????$?̍??>??DDn?q??y?0?ỉ??h??4?Ai??G?8E? ?b??V6VQLE?[|?<Ͽe7?s'?0؊?p?#?4???7?0?IÜ?Zp???DY?;?i?b???+89R.??B???Q[???2e:c???.w?W?fy[7? 
???僈4y?{Y?F&????bzI0?2w-?K??'??%??bZ}A?d?4n??N??gN?Ca?;??W-?cgP???s?T?ߜ?????dΰ"???ķ?(????x????<?r.?J??z֣???z????=?3m?}'??J^Uξ??)9?W/o?q???ڊCh?/்p?????D!~(n?-D???GQXh?/?!??R?N?4jtEʭ?bg???????	??m?,o???5?j]???S?r??>?Jyl??$D?????#?ܤ?Y#R??%J??6??r?J?bG?5|?VI???3ѐ??c??????L?????[.???R/H??WW?X????F?/??]??ƹ=7p? ?a??A???0
?>?$Y0????8?7ř;?????a?????f?7ʆc?dn:?A??x?n??`???_?????e??r/r???[q 8Ʊ?o??p???bR?9!6??m?}?SW?9@U?Z??L[????Y??t?{ܐ??u?d ?l?]?j?@?0i??~??H?L?8?U???????A<??f?O?A?~??,$???zQRpM?\4#???`r~e\M???BA???g?8h??????+'??h?5àg'???/w?}H??Y?%h?lBI?Άg?/
]?z???????2??/???6î?SQ0?46?????Dx??%????^???k !?? ???c?$X?c????-??j?M?B???R?BM??)ݞ?3{??E7???W???Ѓ?	fqz??ozU??6iL/??嬇Q????M?%Sl??މ_L.?? ??8??/4??b!{??^#ԡ9?????,?A@M?Ԯ??.???~?u???z?????T??k~Y?0?;5??\?/?ʊ???ַ??HD??ޏ??ȵ??F?ij-ӧO??ad??75	2-l	???Y
*??.?0?O???L%?T?%??෇eQ0Œ?>?C??~I;????Ҿ?[mw{? <_????w/4xKu?0?(? ?? ????l`???Q?1?Io????Q{?Mv?'W?????F?惚|sr??B??X#?)>y-5{? a#v T?????<VZ???x?:? 7Ôp?ѓ?ī4e?%????=?e2ɅqE???
?՝cWw??vWW|??|???V?????????????3tv????H??HȆ??
?{%D
GGޘ9??âq8??(?A0????r7?d?%DeW(m???B?P??y??Idg?}N 3%2???v`?????f?҆?/X??<L?????فÂ$'??׻]????# 1????v?Ǳ'G??c?????c?ȋ|?c'kأRN	%8D@|?JK:?p??=:ژ)???^??W??!?-?m?}ck??gG????65?	[p?n????????$?tܪ?7A(??Z???L,,8?eJ?
??F*??%O?bI?_?l?5L???D?x???Oa?c? ?Բ????t???8?(?8H"&S?????????o??8??FN0??4?]? gc?M?2???k??`u6??`?2S?????a???c?9bxά?j??J2h?S??``?????{???S?Ϭ??A???@??(k?}]?v?E?22???|?X?T?^???v^??0?Qk~?? ??0N??????3<([????h68Aj??F?? ????;?@N?Y??6???g:;?	~F?K?7?˃???I]?U??߯?0?:?{???.???x&F/?????,>??????ԗ?7???D<P??Vm32?t??????҂O)?????[???)X?%<*??`64???S??S?j???^???i?? /??A???C???`<??a???iZ?????z????#???1?????*??J?{???Kn"?o??????qx???sz¶??G?-Q??kA ?)L<??D(??<?@?A??<PieQ?&??B	hA?E??N??+f??*r庤HS,??
??t??)hӴ%?:?匄?nO-iq+M?Q!wp???mv*?9?bP?a??r1G5M??@ɇ?4?u;?;???Ce?/???κR?H?-D???&?%T5D?m?1?\#?k	?J??G??j??	>????)}!?ܪƖP??b?ctz??W9ٗ?~??I$?n
K?|??4%|ôX?dFT~mh???z???Lr?j?%??d??4c?????Po?lQg??Ot???>???~%????ê??)??(?VdIF?6??g??o"?Jl/?T1n?pE?A?~??lI??zzF$1?S???yK???QS?z?U?????]؅?????l??V??$?ԁ??:m??D)gц??S?W?#l5A??B???Z??oT??????<?&??o2+?Z?7	?Y?~]?p????0<Y8??2`j^k??????kX
????jj?R?
'n{?OǾ`o???&w?*?T????w????:???I? *
j95??r??z??¶???&W?I???!?g??@????W UIEW֬arl??F?X???T???`/<S?'uO?{??쥃?x ?" ?'}>??$Ly<M?t????8?_?/?o¶>
?W???0??????/{?i哅*d(#?D"VJ?u???};!??[T.E???????Q/?6?k?vi?gx?:=?;k??.|?s??>2??s?Z7??A?t?o?+ݰ$? F?!??l`?'7?????6q?lf<:???b??݉3&?F?U???SB@T?` ?
IG}???uz螞??󿓷?i}?if;???#7?1P?}??C?k'??y?s-??f???O?'PF?B??q??}]????s?IA?J?X ?Y?????v|X?+?q????+??7??`?yʺ<??rEo0-??*????\ea???3?zr??????HA??k?̩??.???p???n;&??mT???T???"5?uԭ??<?????=?"?Q??^شK`*@Im???΀Z?OΨ???A?2????q?C?k~V?m????6ƔTRḾ???ǚ\?k~#k?X?}????m1?&|??f??~???1$???d?ɞjEב??????hUK??ßQ*???.??w?zl??؉??55޴P`~?m?0?????	q??j*-??????ё?%j??+?O???5r??;?k???2U?OP??߾?uOv#??3??r??ֈ????"
>???Z7x.`??p/I??uR?b&-3?Q?EVd?K?c_ڗͪcC?/??ހE;?^b?Q?4??W?]|??????????K???wuiW7t_?u??&w?Х??2??/??o??{????z?b`?s[[R?????I???^t?5=V`?֖??Jji[l???j[???^˔?4J?FQ#?V?y?z4?(?7??6N??)˦?vL?-??m??B??:?J?;????JAw@?J???!?iN\??2??t????E2???Ik???-??ug?N?rZ?h%?gXw?ݩo?%????]5h??v?(4?#?t^S??9]?*?X?L???????ޔ??Q=,^R?B>? n  
?g?PD??LZ~?I?qt?bSYwwk??lO??iS??A?????#`???v
?|褐l?&?????`? ???1??qd?vR?<#??/?$??/?o?ȷ????8??ٜ??o???2O?ə?k%?`?7om>????]?ke?{}?0ԑt??????f??u:9?W?M?[ڵ냖/?'??IڊF?)??i2??~W???*
?????4q"JkC??
?e?ˌ?:t.??]?ٷ X???=???^??P@?+6????Ǜ#j???Ldeo77V?{??쒮?6??D=[ӆ?WXTuWGT????rF?Uv??d???????]wFA8?w-??~??q[??qvs\?????Sm뽷???????I      ?       x??0?4?4??0Rf\f@ڐ+F??? 6r?      ?   ?  x????r?0??ڧ?[?CR, ?AӖLB`f:\X?H?-?$o????ue?g&k??O+????6j?ɥc???廭?p#3mq?ٜ= z$?C??????S??"b??,?YX?8?ShWN?ȵ?*G??S
?)?.+d?Y?ZM?'!?8D?)?kH?	?]}J?D????F???,??o?!j?D?*g}????-T?r?ط0BԪ???Oy??*mf j??͜L٨ ???2*??Y?Z?4=˝̪???ui??/ o??rN??GB?ýv	Ε1??????Y"C??8?z?W"?<?%??eVǇ#?8g.Q???21?%?,?%??v???rG??춵?\?i?d??,?ij??6?ı~??M3?9M%XRԔ?ɫ??2?ܙ?c?0Bę?t??svC?c?Z??[?@\?D#??Ke??g)\Q????ս??r?-C??:???o?z??j?Fgr+sWﱋwG܈8????RJ???U?n?
Mު???l&??d?뙩?58@???k=?|??/??;???"iZ`?k?<h]8???2n?)????[??&?????????/???[J?B??;W"??F%?????un?c?1?GM͌?A}|???W??h???33?6??2??lj_?+ :??\??kF???Y????3?<ݩ????X?_{?B???????&tT?aZ????/?Rѻ??}l?????>?      ?   v  x????r?@E??)RXQ?0	??J??4????(??????1VI?????;w?t?????$?K	??????P?Ckw???8??#?̕?]e_?mU??_\|??i?6\?&۠/?E???Y?偌?k????
ȥNw?FI?v??T???)???|??|?9媅x????s?.????[wQ/?"b?;M[?Aĭ?ޝ??2???)????????Q??U>/+-?ג?<??"=IEd+r?f
"?FC;g???M?,??n?'????s???q????X?'7?Gm?v??V????4D?????G?~,ҏ??͊b>??4????1g??{????6?b(?z?S0π??Q?"Y^?j????F?M_?`0??j??     