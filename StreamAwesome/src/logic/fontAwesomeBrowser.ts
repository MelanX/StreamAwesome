import type { FontAwesomeFamily, FontAwesomeStyle } from '@/model/fontAwesomeConstants'
import { FontAwesomeIconType } from '@/model/fontAwesomeIconType'

export class FontAwesomeBrowser {
  public constructor(private readonly fontVersion: string) {}

  private fontAwesomeAPIEndpoint = 'https://api.fontawesome.com'
  private searchDetails =
    'id\nlabel\nunicode\nfamilyStylesByLicense\n{free {family,style},pro{family,style}}'

  public async getAvailableIcons(
    searchTerm: string,
    quantity: number = 39
  ): Promise<Array<FontAwesomeIconType>> {
    const response = await fetch(this.fontAwesomeAPIEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{ search(version: "${this.fontVersion}", query: "${searchTerm}", first: ${quantity}) {${this.searchDetails}} }`
      })
    })

    const json = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icons = json.data.search.map((entry: any) => this.entryToFontAwesomeIcon(entry))
    return icons
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private entryToFontAwesomeIcon(entry: any): FontAwesomeIconType {
    const id: string = entry.id
    const label: string = entry.label
    const unicode: string = entry.unicode
    const familyStyles: {
      free: { family: FontAwesomeFamily; style: FontAwesomeStyle }[]
      pro: { family: FontAwesomeFamily; style: FontAwesomeStyle }[]
    } = entry.familyStylesByLicense

    if (id == null || label == null || unicode == null || familyStyles == null) {
      console.error(`Could not convert result entry "${id}" to FontAwesomeIcon`)

      return FontAwesomeIconType.createFallBackIcon()
    }

    return new FontAwesomeIconType(id, label, unicode, familyStyles)
  }
}
