module.exports = {
	base: '/',
	title: 'Ontop',
	themeConfig: {
		repo: 'ontop/ontop',
		docsRepo: 'ontop/ontop-website',
		editLinks: true,
		lastUpdated: 'Last Updated',
		nav: [
			{
			  text: 'Guide',
			  link: '/guide/',
			},
			{
				text: 'Tutorial',
				link: '/tutorial/',
			},
			{
				text: 'Community',
				link: '/community/'
			},
			{
				text: 'Research',
				link: '/research/'
			},
			{
				text: 'Dev',
				link: '/dev/'
			},
		],
		sidebar: {
			'/guide/': genGuideSidebarConfig(),
			'/tutorial/': genTutorialSidebarConfig(),
			'/dev/': genDevSidebarConfig(),
			'/community/': genCommunitySidebarConfig(),
			'/research/': genResearchSidebarConfig(),
		}
	},
	plugins: [
		['mathjax', {
		  target: 'svg',
		  macros: {
			'*': '\\times',
		  },
		}],
		["vuepress-plugin-matomo",
			{
			  'siteId': 2,
			  'trackerUrl': "https://ontopic.matomo.cloud/"
			}
		  ]
	  ]
}

function genGuideSidebarConfig () {
	return [
	  {
		title: 'Guide',
		collapsable: false,
		children: [
		  '',
		  'concepts',
		  'getting-started',
		  'cli'
		]
	  },
	//   {
	// 	title: 'Advanced',
	// 	collapsable: false,
	// 	children: [
	// 	]
	//   },
	  {
		title: 'Troubleshooting',
		collapsable: false,
		children: [
			'troubleshooting/faq'
		]
	  },
	  {
		title: 'Meta',
		collapsable: false,
		children: [
		  'glossary',
		  'releases'
		]
	  }
	]
  }

function genDevSidebarConfig () {
	return [
	  {
		title: 'Development',
		collapsable: false,
		children: [
		  '',
		  'git',
		  'build',
		  'new-release',
		  'debug-protege',
		  'debug-jetty'
		]
	  },
	  {
		title: 'Internals',
		collapsable: false,
		children: [
		  'internals/iq',
		]
	  },
	  {
		  title: 'Outdated corner',
		  children: [
			'outdated/known-issues',
		  ]
	  }
	]
  }

  function genTutorialSidebarConfig () {
	return [
	  {
		title: 'Tutorial',
		collapsable: false,
		children: [
		  '',
		]
	  },
	  {
		title: 'Basics',
		collapsable: false,
		children: [
		  'basic/setup',
		  'basic/university-1',
		  'basic/university-2',
		]
	  },
	  {
		title: 'Endpoint',
		collapsable: false,
		children: [
			'endpoint/',
		  'endpoint/endpoint-cli',
		  'endpoint/endpoint-docker',
		  //'endpoint/endpoint-tomcat',
		]
	  },
	  {
		title: 'Interact',
		collapsable: false,
		children: [
			'interact/cli.md',
			'interact/jupyter.md',
		]
	  },
	  {
		title: 'Mapping',
		collapsable: false,
		children: [
			'mapping/',
		  'mapping/primary-keys',
		  'mapping/foreign-keys',
		  'mapping/uri-templates',
		  'mapping/existential',
		]
	  },
	  {
		title: 'Federation',
		collapsable: false,
		children: [
			'federation/',
		  'federation/denodo/',
		  'federation/dremio/',
		]
	  },
	  /*{
		title: 'Api',
		collapsable: false,
		children: [
			'api/',
		]
	  }*/

	]
  }

function genCommunitySidebarConfig () {
	return [
	  {
		title: 'Community',
		collapsable: false,
		children: [
		  '',
		  'organizations',
		  'support',
		]
	  },
	  {
		title: 'Contributing',
		collapsable: false,
		children: [
			'contributing/',
			'contributing/bug-report',
			'contributing/pull-request',
		  'contributing/documentation'
		]
	  }
	]
  }


function genResearchSidebarConfig () {
	return [
	  {
		title: 'Research',
		collapsable: false,
		children: [
		  '',
		  'publications',
		]
	  },
	  {
		title: 'Theory',
		collapsable: false,
		children: [
		  'notation',
		  'iq-formal',
		  'optimization',
		]
	  }
	]
  }
