import * as React from 'react'
import * as Icons from '../../src'
import { IconType } from '../../src/icon'

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

  return (
    <div className="page">
      <h1>@cohesic/react-icons Gallery</h1>
      <div>
        {Object.keys(Icons)
          .reduce(groupIconsByName(Icons), [])
          .map(({ name, icons }) => (
            <div key={name} className="icon-group">
              <h2>{name}</h2>
              <div className="icon-group-icons">
                {icons.map(({ name: iconName, component: Icon }) => (
                  <div key={iconName} className="icon">
                    <Icon className="icon-proper" size={24} />
                    <div className="icon-name">{iconName}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Home
