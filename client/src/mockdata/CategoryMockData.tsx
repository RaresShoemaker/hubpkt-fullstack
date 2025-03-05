// type CategoryCardDataType = {
// 	alt: string;
// 	href?: string;
// 	logo: React.ReactNode;
// 	logoWhite?: React.ReactNode;
// 	genre?: string;
// 	description?: string;
// 	title?: string;
// };

// type CategoryDataType = Record<
// 	string,
// 	{
// 		title: string;
// 		data: CategoryCardDataType[];
// 		isViewOnly?: boolean;
// 		squareView?: boolean;
// 	}
// >;

// export const CategoryData: CategoryDataType = {
// 	hot: {
// 		title: `What's Hot`,
// 		data: [
// 			{
// 				alt: 'Gala Games',
// 				href: 'https://www.gala.games/',
// 				logo: <GamesIcons.GalaGamesLogoRegular />,
// 				logoWhite: <GamesIcons.GalaGamesLogoWhite />
// 			},
// 			{
// 				alt: 'Monkey Tilt',
// 				href: 'https://www.monkeytilt.com/',
// 				logo: <CasinoIcons.MonkeyTiltLogoRegular />
// 			},
// 			{
// 				alt: 'Base',
// 				href: 'https://www.base.org/',
// 				logo: <TechnologyIcons.BaseLogoRegular />,
// 				logoWhite: <TechnologyIcons.BaseLogoWhite />
// 			},
// 			{
// 				alt: 'Audius',
// 				href: 'https://www.audius.co',
// 				logo: <MusicIcons.AudiusLogoRegular />,
// 				logoWhite: <MusicIcons.AudiusLogoWhite />
// 			},
// 			{
// 				alt: 'Tenex',
// 				href: 'https://tenexcasino.io/',
// 				logo: CasinoIcons.TenexLogoRegular
// 			},
// 			{
// 				alt: 'Monster Children TV',
// 				href: 'https://monsterchildren.tv/',
// 				logo: <MediaIcons.MonsterChildrenTvLogoRegular />,
// 				logoWhite: <MediaIcons.MonsterChildrenTvLogoWhite />
// 			},
// 		],
// 		isViewOnly: true
// 	},
// 	discover: {
// 		title: `Discover`,
// 		data: [
// 			{
// 				alt: 'Sharpnel',
// 				href: 'https://www.shrapnel.com/',
// 				logo: <GamesIcons.SharpnelLogoRegular />,
// 				logoWhite: <GamesIcons.SharpnelLogoWhite />
// 			},
// 			{
// 				alt: 'Vabble',
// 				href: 'https://www.vabble.com/',
// 				logo: <MediaIcons.VabbleLogoRegular />,
// 				logoWhite: <MediaIcons.VabbleLogoWhite />
// 			},
// 			{
// 				alt: 'Ritestream',
// 				href: 'https://www.ritestream.io/',
// 				logo: <MediaIcons.RitestreamLogoRegular />,
// 				logoWhite: <MediaIcons.RitestreamLogoWhite />
// 			},
// 			{
// 				alt: 'Apeflix',
// 				href: 'https://www.apeflix.io/',
// 				logo: <MediaIcons.ApeflixLogoRegular />
// 			},
// 			{
// 				alt: 'Tune.fm',
// 				href: 'https://tune.fm/home',
// 				logo: <MusicIcons.TuneFmLogoRegular />,
// 				logoWhite: <MusicIcons.TuneFmLogoWhite />
// 			},
// 			{
// 				alt: 'Moon Poker',
// 				href: 'https://www.moonpoker.com/',
// 				logo: <CasinoIcons.MoonPokerLogoRegular />
// 			},
// 		],
// 		isViewOnly: true
// 	},
// 	creators: {
// 		title: 'Creator Hub',
// 		data: [
// 			{
//         alt: 'Hercules-IMG',
//         title: 'Hercules',
//         logo: FilmImg.HerculesImg,
//         description: "Dwayne Johnson's Hercules leads a rebellion against a ruthless warlord.",
//         genre: 'Action',
// 				href: "https://www.amazon.com/Hercules-Dwayne-Johnson/dp/B00OPX5M9M",
//       },
// 			{
//         alt: 'EveryoneIsDoingGreat-IMG',
//         title: 'Everyone Is Doing Great',
//         logo: TvImg.EveryoneIsDoingGreatImg,
//         description: "TV stars Seth and Jeremy (Lafferty and Colletti) try to reclaim their fame.",
// 				genre: 'TV',
// 				href: "https://www.amazon.com/gp/video/detail/amzn1.dv.gti.7d23bc05-bf4e-4427-ac47-79d0d3c0142e?autoplay=0&ref_=atv_cf_strg_wb",
//       },
// 			{
//         alt: 'CrookCounty-IMG',
//         title: 'Crook County',
//         logo: PodcastImg.CrookCountyImg,
//         description: "A true crime series about a firefighter's secret life as a hitman.",
// 				genre: 'Podcasts',
// 				href: "https://www.crookcountypodcast.com/",

//       },
// 			{
//         alt: 'WHAM-IMG',
//         title: 'WHAM (Extended Version)',
//         logo: MusicImg.WhamImg,
//         description: 'Lil Baby',
// 				genre: 'Music',
// 				href: "https://open.spotify.com/artist/5f7VJjfbwm532GiveGC0ZK?si=uaBoW58jRPakwGXdT5NlHQ",
//       },
// 			{
//         alt: 'ParadiseStateofMind-IMG',
//         title: 'Paradise State of Mind',
//         logo: MusicImg.ParadiseStateOfMindImg,
//         description: 'Foster the People',
// 				genre: 'Music',
// 				href: "https://open.spotify.com/album/27ynHS80OjICdw3qLNMgQP?si=BatcmiqAQTeAKiREl8M4Dg"
//       },
// 			{
//         alt: 'DenofThieves-IMG',
//         title: 'Den of Thieves',
//         logo: FilmImg.DenOfThievesImg,
//         description: "Gerard Butler stars in this sequel set in Europe as he faces the mafia.",
//         genre: 'Crime Thriller',
// 				href: "https://tv.apple.com/us/movie/den-of-thieves-2-pantera/umc.cmc.1bzf87ht24ikuj5dbmjjoaqpi,"
//       },
// 			{
// 				alt: 'WishYouWereHere-IMG',
//         title: 'Wish You Were Here',
//         logo: FilmImg.WishYouWereHereImg,
//         description: "Julia Stiles directorial debut based on the best selling novel.",
//         genre: 'Drama',
// 				href: "https://www.youtube.com/watch?v=pr_nVsfoUm8"
// 			},
// 			{
// 				alt: 'Oblivion-IMG',
//         title: 'Oblivion',
//         logo: FilmImg.OblivionImg,
//         description: "Tom Cruise stars as a drone repairman who questions his past after a rescue.",
//         genre: 'Sci-Fi',
// 				href: "https://www.amazon.com/Oblivion-Tom-Cruise/dp/B00DP3IESY/ref=sr_1_1?crid=3MA1ETH25A07C&dib=eyJ2IjoiMSJ9.Cshda2CJ-DipnndbDOGRYRIeccedzlv4ShYeXnzEc8VsT3A7d0r5rTaH08pldgyYGDvNNu1-FtXbreJdwSbfueKa8HLE6EcX3sxG9c5B6LX1Bc9PC1TQBUKuUcYY0qS035IXxbUyQ7rh0sLfr7-ZZUtPxC6Jv_s5guQFvjdVKrA6KMSNjuYFZE1Am3buu0JhadK3_C9H9xNJ5JB-pwCxbyANDP0nM6mdjT8nGPPsmMo.cskmCSuYiHMDFs6SGCE29SJvE7bxaXoggOwVfzBBIFQ&dib_tag=se&keywords=oblivion&qid=1737078811&s=instant-video&sprefix=oblivion%2Cinstant-video%2C154&sr=1-1"
// 			},
// 			{
//         alt: 'JimmyShin-IMG',
//         title: 'Jimmy Shin',
//         logo: TvImg.JimmyShinImg,
//         description: 'Comedy Special starring Jimmy Shin about life as a first generation Korean in America.',
// 				genre: 'TV',
// 				href: "https://watch.amazon.com/detail?gti=amzn1.dv.gti.ef87b53e-6595-4fc4-b949-3789a8a39672",
//       },
// 			{
//         alt: 'ThePatMcAfeeShow-IMG',
//         title: 'The Pat McAfee Show',
//         logo: TvImg.ThePatMcAffeImg,
//         description: "A candid sports show highlighting the day's top stories with Pat McAfee.",
// 				href: "https://www.patmcafeeshow.com/listentopat",
// 				genre: 'TV'
//       },
// 			{
//         alt: 'ThePenguin-IMG',
//         title: 'The Penguin',
//         logo: TvImg.ThePenguinImg,
//         description: "The Penguin strives to control Gotham's crime world after The Batman.",
// 				genre: 'TV',
// 				href: "https://www.max.com/shows/penguin/5756c2bf-36f8-4890-b1f9-ef168f1d8e9c",
//       },
// 			{
//         alt: 'LongevityJunky-IMG',
//         title: 'Longevity Junky',
//         logo: PodcastImg.LongevityJunkyImg,
//         description: 'Dr. Buck Joffrey and Nikki Leigh explore the latest in wellness and longevity.',
// 				href: "https://open.spotify.com/show/5fy2a9TnVA1fkX0BVdncTg",
// 				genre: 'Podcasts'
//       },
// 			{
//         alt: 'DeBìTiRARMáSFOTos-IMG',
//         title: 'DeBì TiRAR MáS FOTos',
//         logo: MusicImg.DebiTirarMasFotoImg,
//         description: 'Bad Bunny',
// 				href: "https://open.spotify.com/album/5K79FLRUCSysQnVESLcTdb?si=4lujrLrjSFe7p32c1MmqNQ",
// 				genre: 'Music'
//       },
// 		],
// 		squareView: true
// 	},
// 	media: {
// 		title: 'Media',
// 		data: [
// 			{
// 				alt: 'Vabble',
// 				href: 'https://www.vabble.com/',
// 				logo: <MediaIcons.VabbleLogoRegular />,
// 				logoWhite: <MediaIcons.VabbleLogoWhite />
// 			},
// 			{
// 				alt: 'Netflix',
// 				href: 'https://www.netflix.com',
// 				logo: <MediaIcons.NetflixLogoRegular />,
// 				logoWhite: <MediaIcons.NetflixLogoWhite />
// 			},
// 			{
// 				alt: 'Prime Video',
// 				href: 'https://www.primevideo.com',
// 				logo: <MediaIcons.AmzPrimeLogoRegular />,
// 				logoWhite: <MediaIcons.AmzPrimeLogoWhite />
// 			},
// 			{
// 				alt: 'Monster Children TV',
// 				href: 'https://monsterchildren.tv/',
// 				logo: <MediaIcons.MonsterChildrenTvLogoRegular />,
// 				logoWhite: <MediaIcons.MonsterChildrenTvLogoWhite />
// 			},
// 			{
// 				alt: 'Apeflix',
// 				href: 'https://www.apeflix.io/',
// 				logo: <MediaIcons.ApeflixLogoRegular />
// 			},
// 			{
// 				alt: 'Disney Plus',
// 				href: 'https://www.disneyplus.com',
// 				logo: <MediaIcons.DisneyLogoRegular />,
// 				logoWhite: <MediaIcons.DisneyLogoWhite />
// 			},
// 			{
// 				alt: 'Acorn TV',
// 				href: 'https://www.acorn.tv',
// 				logo: <MediaIcons.AcornLogoRegular />,
// 				logoWhite: <MediaIcons.AcornLogoWhite />
// 			},
// 			{
// 				alt: 'Apple TV',
// 				href: 'https://tv.apple.com/',
// 				logo: <MediaIcons.AppleTvLogoRegular />,
// 				logoWhite: <MediaIcons.AppleTvLogoWhite />
// 			},
// 			{
// 				alt: 'Fireside',
// 				href: 'https://firesidechat.com',
// 				logo: <MediaIcons.FiresideLogoRegular />,
// 				logoWhite: <MediaIcons.FiresideLogoWhite />
// 			},
// 			{
// 				alt: 'Youtube',
// 				href: 'https://www.youtube.com/',
// 				logo: <MediaIcons.YtbLogoRegular />,
// 				logoWhite: <MediaIcons.YtbLogoWhite />
// 			},
// 			{
// 				alt: 'Fubo TV',
// 				href: 'https://www.fubo.tv',
// 				logo: <MediaIcons.FuboTvLogoRegular />,
// 				logoWhite: <MediaIcons.FuboTvLogoWhite />
// 			},
// 			{
// 				alt: 'Max',
// 				href: 'https://www.hbomax.com/',
// 				logo: <MediaIcons.HboMaxLogoRegular />,
// 				logoWhite: <MediaIcons.HboMaxLogoWhite />
// 			},
// 			{
// 				alt: 'Hulu',
// 				href: 'https://www.hulu.com/',
// 				logo: <MediaIcons.HuluLogoRegular />,
// 				logoWhite: <MediaIcons.HuluLogoWhite />
// 			},
// 			{
// 				alt: 'Lbry',
// 				href: 'https://lbry.com',
// 				logo: <MediaIcons.LbryLogoRegular />,
// 				logoWhite: <MediaIcons.LbryLogoWhite />
// 			},
// 			{
// 				alt: 'Mogul',
// 				href: 'https://film3.mogulproductions.com/platform/showcase',
// 				logo: <MediaIcons.MogulLogoRegular />,
// 				logoWhite: <MediaIcons.MogulLogoWhite />
// 			},
// 			{
// 				alt: 'Paramount Plus',
// 				href: 'https://www.paramountplus.com',
// 				logo: <MediaIcons.ParamountLogoRegular />,
// 				logoWhite: <MediaIcons.ParamountLogoWhite />
// 			},
// 			{
// 				alt: 'Peacock',
// 				href: 'https://www.peacocktv.com',
// 				logo: <MediaIcons.PeacockLogoRegular />,
// 				logoWhite: <MediaIcons.PeacockLogoWhite />
// 			},
// 			{
// 				alt: 'Pluto Tv',
// 				href: 'https://www.pluto.tv',
// 				logo: <MediaIcons.PlutoLogoRegular />,
// 				logoWhite: <MediaIcons.PlutoLogoWhite />
// 			},
// 			{
// 				alt: 'Ritestream',
// 				href: 'https://www.ritestream.io/',
// 				logo: <MediaIcons.RitestreamLogoRegular />,
// 				logoWhite: <MediaIcons.RitestreamLogoWhite />
// 			},
// 			{
// 				alt: 'Sling',
// 				href: 'https://www.sling.com',
// 				logo: <MediaIcons.SlingLogoRegular />,
// 				logoWhite: <MediaIcons.SlingLogoWhite />
// 			},
// 			{
// 				alt: 'Tubi',
// 				href: 'https://www.tubi.tv',
// 				logo: <MediaIcons.TubiLogoRegular />,
// 				logoWhite: <MediaIcons.TubiLogoWhite />
// 			}
// 		]
// 	},
// 	music: {
// 		title: 'Music',
// 		data: [
// 			{
// 				alt: 'Apple Music',
// 				href: 'https://music.apple.com/',
// 				logo: <MusicIcons.AppleMusicLogoRegular />,
// 				logoWhite: <MusicIcons.AppleMusicLogoWhite />
// 			},
// 			{
// 				alt: 'Async',
// 				href: 'https://async.art/',
// 				logo: <MusicIcons.AsyncLogoRegular />,
// 				logoWhite: <MusicIcons.AsyncLogoWhite />
// 			},
// 			{
// 				alt: 'Youtube Music',
// 				href: 'https://music.youtube.com/',
// 				logo: <MusicIcons.YtbLogoRegular />,
// 				logoWhite: <MusicIcons.YtbLogoWhite />
// 			},
// 			{
// 				alt: 'Audius',
// 				href: 'https://www.audius.co',
// 				logo: <MusicIcons.AudiusLogoRegular />,
// 				logoWhite: <MusicIcons.AudiusLogoWhite />
// 			},
// 			{
// 				alt: 'Bitsong',
// 				href: 'https://bitsong.io/',
// 				logo: <MusicIcons.BitsongLogoRegular />,
// 				logoWhite: <MusicIcons.BitsongLogoWhite />
// 			},
// 			{
// 				alt: 'Blokur',
// 				href: 'https://blokur.com/',
// 				logo: <MusicIcons.BlokurLogoRegular />,
// 				logoWhite: <MusicIcons.BlokurLogoWhite />
// 			},
// 			{
// 				alt: 'eMusic',
// 				href: 'https://www.emusic.com/',
// 				logo: <MusicIcons.EmusicLogoRegular />,
// 				logoWhite: <MusicIcons.EmusicLogoWhite />
// 			},
// 			{
// 				alt: 'Ujo',
// 				href: 'https://mesh.xyz/',
// 				logo: <MusicIcons.MeshLogoRegular />,
// 				logoWhite: <MusicIcons.MeshLogoWhite />
// 			},
// 			{
// 				alt: 'Musicoin',
// 				href: 'https://musicoin.org/',
// 				logo: <MusicIcons.MusiLogoRegular />,
// 				logoWhite: <MusicIcons.MusiLogoWhite />
// 			},
// 			{
// 				alt: 'Mycelia',
// 				href: 'http://myceliaformusic.org/',
// 				logo: <MusicIcons.MyceliaLogoRegular />,
// 				logoWhite: <MusicIcons.MyceliaLogoWhite />
// 			},
// 			{
// 				alt: 'Revelator',
// 				href: 'https://revelator.com/',
// 				logo: <MusicIcons.RevelatorLogoRegular />,
// 				logoWhite: <MusicIcons.RevelatorLogoWhite />
// 			},
// 			{
// 				alt: 'Resonate',
// 				href: 'https://resonate.is/',
// 				logo: <MusicIcons.ResonateLogoRegular />,
// 				logoWhite: <MusicIcons.ResonateLogoWhite />
// 			},
// 			{
// 				alt: 'Royal',
// 				href: 'https://royal.io/',
// 				logo: <MusicIcons.RoyalLogoRegular />,
// 				logoWhite: <MusicIcons.RoyalLogoWhite />
// 			},
// 			{
// 				alt: 'Sound',
// 				href: 'https://sound.xyz/',
// 				logo: <MusicIcons.SoundLogoRegular />,
// 				logoWhite: <MusicIcons.SoundLogoWhite />
// 			},
// 			{
// 				alt: 'Spotify',
// 				href: 'https://www.spotify.com/',
// 				logo: <MusicIcons.SpotifyLogoRegular />,
// 				logoWhite: <MusicIcons.SpotifyLogoWhite />
// 			},
// 			{
// 				alt: 'Stem',
// 				href: 'https://stem.is/',
// 				logo: <MusicIcons.StemLogoRegular />,
// 				logoWhite: <MusicIcons.StemLogoWhite />
// 			},
// 			{
// 				alt: 'Tune.fm',
// 				href: 'https://tune.fm/home',
// 				logo: <MusicIcons.TuneFmLogoRegular />,
// 				logoWhite: <MusicIcons.TuneFmLogoWhite />
// 			},
// 			{
// 				alt: 'Viberate',
// 				href: 'https://www.viberate.com/',
// 				logo: <MusicIcons.ViberateLogoRegular />,
// 				logoWhite: <MusicIcons.ViberateLogoWhite />
// 			},
// 			{
// 				alt: 'Zora',
// 				href: 'https://zora.co/',
// 				logo: <MusicIcons.ZoraLogoRegular />,
// 				logoWhite: <MusicIcons.ZoraLogoWhite />
// 			}
// 		]
// 	},
// 	games: {
// 		title: 'Games',
// 		data: [
// 			{
// 				alt: 'Floki',
// 				href: 'https://floki.com/',
// 				logo: <GamesIcons.FlokiLogoRegular />
// 			},
// 			{
// 				alt: 'Axie Infinity (AXS)',
// 				href: 'https://axieinfinity.com/',
// 				logo: <GamesIcons.AxieInfinityLogoRegular />
// 			},
// 			{
// 				alt: 'Big Time',
// 				href: 'https://www.bigtime.gg/',
// 				logo: <GamesIcons.BigTimeLogoRegular />
// 			},
// 			{
// 				alt: 'Bloktopia',
// 				href: 'https://bloktopia.com/',
// 				logo: <GamesIcons.BloktopiaLogoRegular />
// 			},
// 			{
// 				alt: 'Chain Monsters',
// 				href: 'https://chainmonsters.com/',
// 				logo: <GamesIcons.ChainMonstersLogoRegular />
// 			},
// 			{
// 				alt: 'CryptoKitties',
// 				href: 'https://www.cryptokitties.co/',
// 				logo: <GamesIcons.CryptoKittiesLogoRegular />,
// 				logoWhite: <GamesIcons.CryptoKittiesLogoWhite />
// 			},
// 			{
// 				alt: 'Decentraland',
// 				href: 'https://decentraland.org/',
// 				logo: <GamesIcons.DecentralandLogoRegular />
// 			},
// 			{
// 				alt: 'Defi Kingdoms',
// 				href: 'https://defikingdoms.com/',
// 				logo: GamesIcons.DefiKingdomsLogoRegular
// 			},
// 			{
// 				alt: 'Ember Sword',
// 				href: 'https://embersword.com/',
// 				logo: <GamesIcons.EmberSwordLogoRegular />,
// 				logoWhite: <GamesIcons.EmberSwordLogoWhite />
// 			},
// 			{
// 				alt: 'Gala Games',
// 				href: 'https://www.gala.games/',
// 				logo: <GamesIcons.GalaGamesLogoRegular />,
// 				logoWhite: <GamesIcons.GalaGamesLogoWhite />
// 			},
// 			{
// 				alt: 'Gas Wizard',
// 				href: 'https://gaswizard.io/',
// 				logo: <GamesIcons.GasWizardLogoRegular />,
// 				logoWhite: <GamesIcons.GasWizardLogoWhite />
// 			},
// 			{
// 				alt: 'God Unchained',
// 				href: 'https://godsunchained.com/',
// 				logo: <GamesIcons.GodUnchainedLogoRegular />
// 			},
// 			{
// 				alt: 'Illuvium',
// 				href: 'https://illuvium.io/',
// 				logo: <GamesIcons.IlluviumLogoRegular />,
// 				logoWhite: <GamesIcons.IlluviumLogoWhite />
// 			},
// 			{
// 				alt: 'Neighbor Alice',
// 				href: 'https://www.myneighboralice.com/',
// 				logo: GamesIcons.NeighborAliceLogoRegular
// 			},
// 			{
// 				alt: 'Sandbox',
// 				href: 'https://sandbox.game/',
// 				logo: <GamesIcons.SandboxLogoRegular />,
// 				logoWhite: <GamesIcons.SandboxLogoWhite />
// 			},
// 			{
// 				alt: 'Sharpnel',
// 				href: 'https://www.shrapnel.com/',
// 				logo: <GamesIcons.SharpnelLogoRegular />,
// 				logoWhite: <GamesIcons.SharpnelLogoWhite />
// 			},
// 			{
// 				alt: 'Splinterlands',
// 				href: 'https://splinterlands.com/',
// 				logo: <GamesIcons.SplinterlandsLogoRegular />
// 			},
// 			{
// 				alt: 'Sponge V2',
// 				href: 'https://sponge.vip/en',
// 				logo: GamesIcons.SpongeLogoRegular
// 			},
// 			{
// 				alt: 'Star Atlas',
// 				href: 'https://staratlas.com/',
// 				logo: <GamesIcons.StarAtlasLogoRegular />,
// 				logoWhite: <GamesIcons.StarAtlasLogoWhite />
// 			},
// 			{
// 				alt: 'SuperVerse',
// 				href: 'https://superversen.com/',
// 				logo: <GamesIcons.SuperverseLogoRegular />
// 			}
// 		]
// 	},
// 	casino: {
// 		title: 'Casino',
// 		data: [
// 			{
// 				alt: 'Tenex',
// 				href: 'https://tenexcasino.io/',
// 				logo: CasinoIcons.TenexLogoRegular
// 			},
// 			{
// 				alt: 'N1 Casino',
// 				href: 'https://www.n1casino.com/',
// 				logo: <CasinoIcons.CasinoLogoRegular />,
// 				logoWhite: <CasinoIcons.CasinoLogoWhite />
// 			},
// 			{
// 				alt: 'BetRebels',
// 				href: 'https://www.betrebels.com/',
// 				logo: <CasinoIcons.BetRebelsLogoRegular />
// 			},
// 			{
// 				alt: 'Casumo Casino',
// 				href: 'https://www.casumo.com/',
// 				logo: <CasinoIcons.CasumoLogoRegular />
// 			},
// 			{
// 				alt: 'Spinia',
// 				href: 'https://www.spinia.com/',
// 				logo: <CasinoIcons.SpiniaLogoRegular />
// 			},
// 			{
// 				alt: 'Monkey Tilt',
// 				href: 'https://www.monkeytilt.com/',
// 				logo: <CasinoIcons.MonkeyTiltLogoRegular />
// 			},
// 			{
// 				alt: 'SlotsMillion Casino',
// 				href: 'https://www.slotsmillion.com/',
// 				logo: <CasinoIcons.SlotsMillionLogoRegular />
// 			},
// 			{
// 				alt: 'Videoslots Casino',
// 				href: 'https://www.videoslots.com',
// 				logo: CasinoIcons.VideoSlotsLogoRegular
// 			},
// 			{
// 				alt: 'Moon Poker',
// 				href: 'https://www.moonpoker.com/',
// 				logo: <CasinoIcons.MoonPokerLogoRegular />
// 			},
// 			{
// 				alt: 'Energy Casino',
// 				href: 'https://energycasino.com/',
// 				logo: <CasinoIcons.EnergyCasinoLogoRegular />
// 			},
// 			{
// 				alt: 'Playojo Casino',
// 				href: 'https://www.playojo.com/',
// 				logo: <CasinoIcons.PlayojoLogoRegular />
// 			},
// 			{
// 				alt: 'King Billy Casino',
// 				href: 'https://www.kingbillycasino.com/',
// 				logo: <CasinoIcons.KingBillyLogoRegular />,
// 				logoWhite: <CasinoIcons.KingBillyLogoWhite />
// 			},
// 			{
// 				alt: 'Casinoluck',
// 				href: 'https://www.casinoluck.com/',
// 				logo: <CasinoIcons.CasinoLuckLogoRegular />
// 			},
// 			{
// 				alt: 'iLucki Casino',
// 				href: 'https://www.ilucki.com/',
// 				logo: <CasinoIcons.LuckiLogoRegular />,
// 				logoWhite: <CasinoIcons.LuckiLogoWhite />
// 			},
// 			{
// 				alt: '24 Bettle Casino',
// 				href: 'https://www.24bettle.com/',
// 				logo: <CasinoIcons.BettleLogoRegular />,
// 				logoWhite: <CasinoIcons.BettleLogoWhite />
// 			},
// 			{
// 				alt: 'Casino X',
// 				href: 'https://www.casino-x.com/',
// 				logo: <CasinoIcons.CasinoXLogoRegular />
// 			},
// 			{
// 				alt: 'Bitkingz Casino',
// 				href: 'https://www.bitkingz.com/',
// 				logo: <CasinoIcons.BitkingzLogoRegular />,
// 				logoWhite: <CasinoIcons.BitkingzLogoWhite />
// 			},
// 			{
// 				alt: 'JoyCasino',
// 				href: 'https://www.joycasino.com/',
// 				logo: <CasinoIcons.JoyCasinoLogoRegular />
// 			}
// 		]
// 	},
// 	technology: {
// 		title: 'Technology',
// 		data: [
// 			{
// 				alt: 'Solana (SOL)',
// 				href: 'https://solana.com/',
// 				logo: <TechnologyIcons.SolanaLogoRegular />,
// 				logoWhite: <TechnologyIcons.SolanaLogoWhite />
// 			},
// 			{
// 				alt: 'Akash Network (AKT)',
// 				href: 'https://akash.network/',
// 				logo: <TechnologyIcons.AkashLogoRegular />,
// 				logoWhite: <TechnologyIcons.AkashLogoWhite />
// 			},
// 			{
// 				alt: 'Cardano (ADA)',
// 				href: 'https://cardano.org/',
// 				logo: <TechnologyIcons.CardanoLogoRegular />,
// 				logoWhite: <TechnologyIcons.CardanoLogoWhite />
// 			},
// 			{
// 				alt: 'XRP (XRP)',
// 				href: 'https://ripple.com/',
// 				logo: <TechnologyIcons.RippleLogoRegular />,
// 				logoWhite: <TechnologyIcons.RippleLogoWhite />
// 			},
// 			{
// 				alt: 'Ethereum (ETH)',
// 				href: 'https://ethereum.org/',
// 				logo: <TechnologyIcons.EthereumLogoRegular />
// 			},
// 			{
// 				alt: 'BNB (BNB)',
// 				href: 'https://www.binance.com/',
// 				logo: <TechnologyIcons.BnbLogoRegular />,
// 				logoWhite: <TechnologyIcons.BnbLogoWhite />
// 			},
// 			{
// 				alt: 'Arbitrum (ARB)',
// 				href: 'https://offchainlabs.com/',
// 				logo: <TechnologyIcons.ArbitrumLogoRegular />,
// 				logoWhite: <TechnologyIcons.ArbitrumLogoWhite />
// 			},
// 			{
// 				alt: 'Sui',
// 				href: 'https://sui.io//',
// 				logo: <TechnologyIcons.SuiLogoRegular />,
// 			},
// 			{
// 				alt: 'Polygon (MATIC)',
// 				href: 'https://polygon.technology/',
// 				logo: <TechnologyIcons.PolygonLogoRegular />,
// 			},
// 			{
// 				alt: 'Avalanche (AVAX)',
// 				href: 'https://www.avalabs.org/',
// 				logo: <TechnologyIcons.AvalancheLogoRegular />,
// 				logoWhite: <TechnologyIcons.AvalancheLogoWhite />
// 			},
// 			{
// 				alt: 'Chainlink (LINK)',
// 				href: 'https://chain.link/',
// 				logo: <TechnologyIcons.ChainLinkLogoRegular />,
// 				logoWhite: <TechnologyIcons.ChainLinkLogoWhite />
// 			},
// 			{
// 				alt: 'Internet Computer (ICP)',
// 				href: 'https://dfinity.org/',
// 				logo: <TechnologyIcons.DfinityLogoRegular />,
// 				logoWhite: <TechnologyIcons.DfinityLogoWhite />
// 			},
// 			{
// 				alt: 'Dogecoin (DOGE)',
// 				href: 'https://dogecoin.com/',
// 				logo: <TechnologyIcons.DogecoinLogoRegular />
// 			},
// 			{
// 				alt: 'Hedera (HBAR)',
// 				href: 'https://www.hedera.com/',
// 				logo: <TechnologyIcons.HederaLogoRegular />
// 			},
// 			{
// 				alt: 'NEAR Protocol (NEAR)',
// 				href: 'https://near.org/',
// 				logo: <TechnologyIcons.NearLogoRegular />,
// 				logoWhite: <TechnologyIcons.NearLogoWhite />
// 			},
// 			{
// 				alt: 'Polkadot (DOT)',
// 				href: 'https://polkadot.network/',
// 				logo: <TechnologyIcons.PolkadotLogoRegular />,
// 				logoWhite: <TechnologyIcons.PolkadotLogoWhite />
// 			},
// 			{
// 				alt: 'Stellar (XLM)',
// 				href: 'https://www.stellar.org/',
// 				logo: <TechnologyIcons.StellarLogoRegular />,
// 				logoWhite: <TechnologyIcons.StellarLogoWhite />
// 			},
// 			{
// 				alt: 'Toncoin (TON)',
// 				href: 'https://ton.org/',
// 				logo: <TechnologyIcons.TonLogoRegular />
// 			},
// 			{
// 				alt: 'TRON (TRX)',
// 				href: 'https://tron.network/',
// 				logo: <TechnologyIcons.TronLogoRegular />,
// 				logoWhite: <TechnologyIcons.TronLogoWhite />
// 			},
// 			{
// 				alt: 'Uniswap (UNI)',
// 				href: 'https://uniswap.org/',
// 				logo: <TechnologyIcons.UniswapLogoRegular />,
// 				logoWhite: <TechnologyIcons.UniswapLogoWhite />
// 			},
// 			{
// 				alt: 'Base',
// 				href: 'https://www.base.org/',
// 				logo: <TechnologyIcons.BaseLogoRegular />,
// 				logoWhite: <TechnologyIcons.BaseLogoWhite />
// 			},
// 			{
// 				alt: 'VeChain (VET)',
// 				href: 'https://www.vechain.org/',
// 				logo: <TechnologyIcons.VechainLogoRegular />
// 			},
// 			{
// 				alt: 'Cosmos (ATOM)',
// 				href: 'https://vectorized.io/',
// 				logo: <TechnologyIcons.CosmosLogoRegular />,
// 				logoWhite: <TechnologyIcons.CosmosLogoWhite />
// 			}
// 		]
// 	}
// };
