declare module 'react-window-infinite-loader' {
  import { ListProps, FixedSizeList, VariableSizeList } from 'react-window';

  interface InfiniteLoaderProps {
    isItemLoaded: (index: number) => boolean;
    itemCount: number;
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void> | void;
    children: (props: {
      onItemsRendered: (props: {
        visibleStartIndex: number;
        visibleStopIndex: number;
        overscanStartIndex: number;
        overscanStopIndex: number;
      }) => void;
      ref: React.Ref<any>;
    }) => React.ReactElement;
  }

  export default function InfiniteLoader(props: InfiniteLoaderProps): React.ReactElement;
}
