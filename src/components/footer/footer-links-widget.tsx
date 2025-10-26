import { Fragment } from "react"
import { Heading, StyledLink } from "./styles"

// ==============================================================
interface Props {
  isDark?: boolean;
  title: string;
  links: { title: string; url: string }[];
}
// ==============================================================

export function FooterLinksWidget({ links, title }: Props) {
  
  const stripHTML = (html: string) => html.replace(/<[^>]+>/g, '')

  return (
    <Fragment>
      <Heading>{title}</Heading>

      {links.map((item, ind) => (
        <StyledLink href={item.url} key={ind}>
          {stripHTML(item.title)}  
        </StyledLink>
      ))}
    </Fragment>
  )
}
