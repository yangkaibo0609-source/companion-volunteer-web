export async function preloadImages(srcList: string[]) {
  await Promise.all(
    srcList.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = () => reject(new Error(`Failed to load ${src}`))
          image.src = src
        }),
    ),
  )
}
