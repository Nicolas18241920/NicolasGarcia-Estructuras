export interface GiphyImageVariant {
  url: string;
  width: string;
  height: string;
}

export interface GiphyImages {
  original: GiphyImageVariant;
  fixed_height: GiphyImageVariant;
  fixed_width: GiphyImageVariant;
}

export interface GifItem {
  id: string;
  title: string;
  url: string;
  rating: string;
  images: GiphyImages;
}

export interface GiphyPagination {
  total_count: number;
  count: number;
  offset: number;
}

export interface GiphySearchResponse {
  data: GifItem[];
  pagination: GiphyPagination;
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}
