import Grid from "@mui/material/Grid"

// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage"
// STYLED COMPONENT
import { StyledRoot } from "./styles"
import { Props } from "@/models/Home.model"

export default function CarouselCard1({
  imgUrl,
  alt
}: Props) {
  return (
    <StyledRoot>
      <Grid container spacing={3} alignItems="center">
        {/* <Grid className="grid-item" size={{ md: buttonText?6:12, xs: 12 }}>
          {title && <h1 className="title">{title}</h1>}
          {description && <p className="description">{description}</p>}

          {buttonText && (
            <Button
              size="large"
              disableElevation
              variant="contained"
              color={buttonColor}
              LinkComponent={Link}
              href={"/products/search"}
              className="button-link"
            >
              {buttonText}
            </Button>
          )}
        </Grid> */}

        <Grid size={{ md: 12, xs: 12 }}>
          <div className="img-wrapper">
            <LazyImage fill src={imgUrl} alt={alt ?? ""} sizes="(max-width: 768px) 100vw, 100vw" />
          </div>
        </Grid>
      </Grid>
    </StyledRoot>
  )
}
