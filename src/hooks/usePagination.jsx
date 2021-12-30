import React, { useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap';

const usePagination = (data) => {
  const [neededData, setNeededData] = useState(data);
  const [page, setPage] = useState(1);
  const [pageLength, setPageLength] = useState(3);
  const [pagingItems, setPagingItems] = useState([]);

  const setData = (newData, page) => {
    setNeededData(newData)
    setPage(page);
  }

  const loadPagination = () => {
    const totalPages = Math.ceil(neededData.length / pageLength);
    let items = [];
    if (totalPages > 1) {
      items = [
        <Pagination.Item key="first" onClick={ () => setPage((prev) => {
          if (prev !== 1) {
            return prev - 1;
          }
          else {
            return prev
          }
        }) }>
          &laquo;
        </Pagination.Item>
      ];

      for (let i = 0; i < totalPages; i++) {
        items.push(
          <Pagination.Item key={ i } active={ i + 1 === page } onClick={ () => setPage(i + 1) }>
            { i + 1 }
          </Pagination.Item>
        )
      }

      items.push(
        <Pagination.Item key="last" onClick={ () => setPage((prev) => {
          if (prev !== totalPages) {
            return prev + 1;
          }
          else {
            return prev
          }
        }) }>
          &raquo;
        </Pagination.Item>
      )
    }
    setPagingItems(items)
  }

  useEffect(() => {
    loadPagination();
  }, [page, neededData])

  return [
    {
      pagingItems: pagingItems,
      data: neededData,
      page: page,
      pageRange: {
        start: pageLength * (page - 1),
        end: pageLength * page
      }
    }
    , setData]
}

export default usePagination
