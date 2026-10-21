import type {
  VerifyCredentialsRequestDto,
  UserDetailResponseDto,
  ChangePasswordRequestDto,
  MenuCategoryBasicResponseDto,
  MenuCategoryUpsertRequestDto,
  MenuItemListResponseDto,
  MenuItemListRequestDto,
  MenuItemDetailResponseDto,
  MenuItemUpsertRequestDto,
  OrderListResponseDto,
  OrderListRequestDto,
  SeatingBasicResponseDto,
  OrderDetailResponseDto,
  OrderUpsertRequestDto,
  ReportFigureResponseDto,
  ReportFigureRequestDto,
  SeatingDetailResponseDto,
  SeatingUpsertRequestDto,
  UserCreateRequestDto
} from './dtos';
import { fetchOrThrowAsync } from './fetch';

const authenticationApi = {
  async getAccessCookieAsync(requestDto: VerifyCredentialsRequestDto): Promise<void> {
    const options = { method: 'post', body: JSON.stringify(requestDto) };
    await fetchOrThrowAsync('/api/authentication/get-access-cookie/', options);
  },

  async clearAccessCookieAsync(): Promise<void> {
    const options = { method: 'post' };
    await fetchOrThrowAsync('/api/authentication/clear-access-cookie/', options);
  },

  async getCallerDetailAsync(): Promise<UserDetailResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/authentication/get-caller-detail/', options);

    return await response.json() as UserDetailResponseDto;
  },

  async changePasswordAsync(requestDto: ChangePasswordRequestDto): Promise<void> {
    const options = { method: 'put', body: JSON.stringify(requestDto) };
    await fetchOrThrowAsync('/api/authentication/change-password/', options);
  },

  async checkAuthenticationStatusAsync(): Promise<void> {
    const options = { method: 'post' };
    await fetchOrThrowAsync('/api/authentication/check-authentication-status/', options);
  }
};

const menuCategoryApi = {
  async getAllAsync(): Promise<MenuCategoryBasicResponseDto[]> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/menu-categories/', options);

    return await response.json() as MenuCategoryBasicResponseDto[];
  },

  async getSingleAsync(id: number): Promise<MenuCategoryBasicResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync(`/api/menu-categories/${id}`, options);

    return await response.json() as MenuCategoryBasicResponseDto;
  },

  async createAsync(requestDto: MenuCategoryUpsertRequestDto): Promise<number> {
    const options = { method: 'post', body: JSON.stringify(requestDto) };
    const response = await fetchOrThrowAsync('/api/menu-categories/', options);

    return await response.json() as number;
  },

  async updateAsync(
    id: number,
    requestDto: MenuCategoryUpsertRequestDto
  ): Promise<void> {
    const options = { method: 'put', body: JSON.stringify(requestDto) };
    await fetchOrThrowAsync(`/api/menu-categories/${id}`, options);
  },

  async deleteAsync(id: number): Promise<void> {
    const options = { method: 'delete' };
    await fetchOrThrowAsync(`/api/menu-categories/${id}`, options);
  }
};

const menuItemApi = {
  async getListAsync(requestDto?: MenuItemListRequestDto): Promise<MenuItemListResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/menu-items/', options, requestDto);

    return await response.json() as MenuItemListResponseDto;
  },

  async getDetailAsync(id: number): Promise<MenuItemDetailResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync(`/api/menu-items/${id}`, options);

    return await response.json() as MenuItemDetailResponseDto;
  },

  async createAsync(requestDto: MenuItemUpsertRequestDto): Promise<number> {
    const options = { method: 'post', body: JSON.stringify(requestDto) };
    const response = await fetchOrThrowAsync('/api/menu-items/', options);

    return await response.json() as number;
  },

  async updateAsync(
    id: number,
    requestDto: MenuItemUpsertRequestDto
  ): Promise<void> {
    const options = { method: 'put', body: JSON.stringify(requestDto) };
    await fetchOrThrowAsync(`/api/menu-items/${id}`, options);
  },

  async deleteAsync(id: number): Promise<void> {
    const options = { method: 'delete' };
    await fetchOrThrowAsync(`/api/menu-items/${id}`, options);
  }
};

const orderApi = {
  async getListAsync(requestDto?: OrderListRequestDto): Promise<OrderListResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/orders/', options, requestDto);

    return await response.json() as OrderListResponseDto;
  },

  async getDetailAsync(id: number): Promise<OrderDetailResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync(`/api/orders/${id}`, options);

    return await response.json() as OrderDetailResponseDto;
  },

  async createAsync(requestDto: OrderUpsertRequestDto): Promise<OrderDetailResponseDto> {
    const options = { method: 'post', body: JSON.stringify(requestDto) };
    const response = await fetchOrThrowAsync('/api/orders/', options);

    return await response.json() as OrderDetailResponseDto;
  },

  async updateAsync(
    id: number,
    requestDto: OrderUpsertRequestDto
  ): Promise<OrderDetailResponseDto> {
    const options = { method: 'put', body: JSON.stringify(requestDto) };
    const response = await fetchOrThrowAsync(`/api/orders/${id}`, options);

    return await response.json() as OrderDetailResponseDto;
  },

  async finishAsync(id: number): Promise<void> {
    const options = { method: 'put' };
    await fetchOrThrowAsync(`/api/orders/${id}/finish`, options);
  },

  async deleteAsync(id: number): Promise<void> {
    const options = { method: 'delete' };
    await fetchOrThrowAsync(`/api/orders/${id}`, options);
  }
};

const reportApi = {
  async getRevenueByPeriodAsync(requestDto?: ReportFigureRequestDto): Promise<ReportFigureResponseDto<number>> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/report/get-revenue-by-period/', options, requestDto);

    return await response.json() as ReportFigureResponseDto<number>;
  },

  async getTurnoverCountByPeriodAsync(requestDto?: ReportFigureRequestDto): Promise<ReportFigureResponseDto<number>> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/report/get-turnover-count-by-period/', options, requestDto);

    return await response.json() as ReportFigureResponseDto<number>;
  }
};

const seatingApi = {
  async getAllAsync(): Promise<SeatingBasicResponseDto[]> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync('/api/seatings/', options);

    return await response.json() as SeatingBasicResponseDto[];
  },

  async getDetailAsync(id: number): Promise<SeatingDetailResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync(`/api/seatings/${id}`, options);

    return await response.json() as SeatingDetailResponseDto;
  },

  async createAsync(requestDto: SeatingUpsertRequestDto): Promise<number> {
    const options = { method: 'post', body: JSON.stringify(requestDto) };
    const response = await fetchOrThrowAsync('/api/seatings/', options);

    return await response.json() as number;
  },

  async updateAsync(
    id: number,
    requestDto: SeatingUpsertRequestDto
  ): Promise<void> {
    const options = { method: 'put', body: JSON.stringify(requestDto) };
    await fetchOrThrowAsync(`/api/seatings/${id}`, options);
  },

  async deleteAsync(id: number): Promise<void> {
    const options = { method: 'delete' };
    await fetchOrThrowAsync(`/api/seatings/${id}`, options);
  }
};

const userApi = {
  async getDetailByIdAsync(id: number): Promise<UserDetailResponseDto> {
    const options = { method: 'get' };
    const response = await fetchOrThrowAsync(`/api/users/${id}`, options);

    return await response.json() as UserDetailResponseDto;
  },

  async createAsync(requestDto: UserCreateRequestDto): Promise<number> {
    const options = { method: 'post', body: JSON.stringify(requestDto) };
    const response = await fetchOrThrowAsync('/api/users/', options);

    return await response.json() as number;
  },

  async deleteAsync(id: number): Promise<void> {
    const options = { method: 'delete' };
    await fetchOrThrowAsync(`/api/users/${id}`, options);
  }
};

export const api = {
  authentication: authenticationApi,
  menuCategory: menuCategoryApi,
  menuItem: menuItemApi,
  order: orderApi,
  report: reportApi,
  seating: seatingApi,
  user: userApi
};
