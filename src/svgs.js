import React from 'react'

const SVGS = (props) => {
    const type = props.type
    return (
        <>
            {
                type === 'logo' &&
                <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33.5731" height="35" rx="5" fill="white" />
                    <path d="M17.7788 18.2402C17.6792 18.2925 17.5962 18.3703 17.5167 18.4498L16.6831 19.2834C16.2153 19.7512 15.4567 19.7512 14.9889 19.2834V19.2834C14.521 18.8155 14.521 18.057 14.9889 17.5891L15.8225 16.7556C15.902 16.676 15.9797 16.593 16.0321 16.4935C16.1233 16.32 16.1651 16.1235 16.151 15.9257C16.1329 15.6715 16.0238 15.4323 15.8435 15.252C15.6633 15.0718 15.4241 14.9626 15.1698 14.9446C14.9721 14.9305 14.7756 14.9723 14.6021 15.0635C14.5025 15.1158 14.4195 15.1936 14.34 15.2731L13.3476 16.2655C12.9675 16.6456 12.3512 16.6456 11.9711 16.2655V16.2655C11.8768 16.1628 11.7623 16.0808 11.6347 16.0247C11.5071 15.9686 11.3692 15.9396 11.2298 15.9396C11.0904 15.9396 10.9526 15.9686 10.825 16.0247C10.6974 16.0808 10.5828 16.1628 10.4886 16.2655L8.90026 17.8539C8.40159 18.3343 8.00415 18.9098 7.73136 19.5463C7.45857 20.1828 7.31596 20.8675 7.31193 21.56C7.30768 21.7946 7.32058 22.0281 7.35008 22.2586C7.53016 23.6661 7.52112 25.2687 6.51776 26.272V26.272C6.41505 26.3663 6.33305 26.4808 6.27696 26.6084C6.22086 26.736 6.19189 26.8739 6.19189 27.0133C6.19189 27.1527 6.22086 27.2905 6.27696 27.4181C6.33305 27.5457 6.41505 27.6603 6.51776 27.7545C6.61199 27.8572 6.72654 27.9392 6.85414 27.9953C6.98173 28.0514 7.1196 28.0804 7.25898 28.0804C7.39837 28.0804 7.53623 28.0514 7.66383 27.9953C7.79142 27.9392 7.90597 27.8572 8.00021 27.7545V27.7545C8.97712 26.7776 10.5231 26.7432 11.8835 26.9842C12.1905 27.0386 12.5032 27.0663 12.8182 27.0662C14.2232 27.0629 15.5717 26.5121 16.5772 25.5308L18.1656 23.9425C18.3651 23.747 18.4793 23.4806 18.4832 23.2013C18.4916 23.0615 18.4672 22.9218 18.4121 22.7931C18.3569 22.6644 18.2725 22.5504 18.1656 22.46V22.46C17.6977 21.9922 17.6977 21.2337 18.1656 20.7658L18.9991 19.9322C19.0787 19.8527 19.1564 19.7697 19.2087 19.6702C19.3 19.4967 19.3417 19.3001 19.3277 19.1024C19.3096 18.8482 19.2004 18.609 19.0202 18.4287C18.84 18.2485 18.6008 18.1393 18.3465 18.1212C18.1488 18.1072 17.9523 18.149 17.7788 18.2402ZM15.0948 24.0484C14.492 24.6338 13.6849 24.9613 12.8446 24.9613C12.0044 24.9613 11.1972 24.6338 10.5945 24.0484L10.3827 23.8366C9.79015 23.2245 9.44989 22.4117 9.42971 21.56C9.44165 20.7221 9.78418 19.9228 10.3827 19.3363V19.3363C10.8498 18.8692 11.6077 18.8714 12.0721 19.3411L15.0725 22.3756C15.5284 22.8366 15.5382 23.5754 15.0948 24.0484V24.0484Z" fill="black" />
                    <path d="M27.0552 7.21802C26.9611 7.11529 26.8467 7.03328 26.7192 6.97717C26.5918 6.92106 26.4541 6.89209 26.3148 6.89209C26.1756 6.89209 26.0379 6.92106 25.9105 6.97717C25.783 7.03328 25.6686 7.11529 25.5745 7.21802V7.21802C24.5423 8.25155 22.8978 8.26829 21.4557 8.03604C21.0602 7.97234 20.656 7.95342 20.2508 7.98152C18.9896 8.06895 17.8014 8.60592 16.9015 9.4951L15.315 11.0838C15.1157 11.2793 15.0017 11.5458 14.9977 11.8251C14.9894 11.9649 15.0137 12.1047 15.0688 12.2334C15.1239 12.3621 15.2082 12.4762 15.315 12.5665L21.5024 18.7623C21.5965 18.865 21.711 18.9471 21.8384 19.0032C21.9659 19.0593 22.1036 19.0882 22.2428 19.0882C22.382 19.0882 22.5197 19.0593 22.6472 19.0032C22.7746 18.9471 22.889 18.865 22.9832 18.7623L24.5697 17.2266C25.0622 16.7335 25.4515 16.147 25.7149 15.5014C25.9782 14.8558 26.1103 14.1641 26.1033 13.4668C26.1026 13.3029 26.0947 13.1396 26.0795 12.9772C25.9388 11.4681 25.9999 9.78865 27.0552 8.70077V8.70077C27.1578 8.60652 27.2397 8.49195 27.2957 8.36432C27.3518 8.2367 27.3807 8.09881 27.3807 7.9594C27.3807 7.81998 27.3518 7.68209 27.2957 7.55447C27.2397 7.42684 27.1578 7.31227 27.0552 7.21802ZM23.0889 15.6909V15.6909C22.6218 16.1587 21.8638 16.1587 21.3966 15.6909L18.3562 12.6463C17.9074 12.197 17.9192 11.4655 18.3823 11.0308V11.0308C18.6734 10.7281 19.0224 10.4873 19.4086 10.3228C19.7948 10.1583 20.2102 10.0736 20.6298 10.0736C21.0495 10.0736 21.4648 10.1583 21.851 10.3228C22.1984 10.4708 22.5157 10.6804 22.7878 10.9413C22.8486 10.9997 22.9113 11.0562 22.9786 11.1069V11.1069C23.052 11.162 23.1212 11.2228 23.181 11.2924C23.7001 11.896 23.9874 12.6672 23.988 13.4668C23.9919 13.8785 23.9144 14.287 23.7602 14.6687C23.6059 15.0504 23.3778 15.3978 23.0889 15.6909Z" fill="black" />
                </svg>

            }
        </>
    )
}

export default SVGS