import Head from 'next/head'
import * as React from 'react'
import * as Icons from '../../src'
import { IconType } from '../../src/icon'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

type IconGroup = {
  name: string
  icons: { name: string; component: IconType }[]
}

function Home() {
  const groupIconsByName =
    (lookup: Record<string, IconType>) =>
    (groups: IconGroup[], componentName: string) => {
      const groupNameMatch = componentName.match(/^[A-Z][a-z]+/)

      if (groupNameMatch !== null) {
        const groupName = groupNameMatch[0]
        const groupIndex = groups.findIndex((g) => g.name === groupName)
        const group: IconGroup =
          groupIndex >= 0 ? groups[groupIndex] : { name: groupName, icons: [] }

        group.icons.push({
          name: componentName,
          component: lookup[componentName],
        })

        if (groupIndex < 0) {
          groups.push(group)
        }
      }

      return groups
    }

  const [_, copyToClipboard] = useCopyToClipboard()
  const handleIconClick = React.useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      const iconName = e.currentTarget.dataset.iconName
      if (iconName && (await copyToClipboard(iconName))) {
        toast.success(`Copied "${iconName}" to the clipboard.`)
      } else {
        toast.error('Something went wrong 😢')
      }
    },
    [copyToClipboard],
  )

  return (
    <main className="page">
      <Head>
        <title>@cohesic/react-icons</title>
      </Head>
      <h1>@cohesic/react-icons</h1>
      <div className="ext-links">
        <Link href="https://github.com/cohesic/react-icons" target="_blank">
          GitHub Repository
        </Link>
        <Link
          href="https://www.npmjs.com/package/@cohesic/react-icons"
          target="_blank"
        >
          npm Package
        </Link>
      </div>
      {Object.keys(Icons)
        .reduce(groupIconsByName(Icons), [])
        .map(({ name, icons }) => (
          <section key={name} className="icon-group">
            <h2>{name}</h2>
            <div className="icon-group-icons">
              {icons.map(({ name: iconName, component: Icon }) => (
                <div
                  key={iconName}
                  className="icon-container"
                  data-icon-name={iconName}
                  onClick={handleIconClick}
                >
                  <div className="icon-wrapper">
                    <Icon className="icon-proper" size={24} />
                  </div>
                  <div className="icon-name">{iconName}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
    </main>
  )
}

export default Home
