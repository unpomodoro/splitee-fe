import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {Button, Container, Flex, Heading, Text} from "@chakra-ui/react";
import {useFetch} from "../hooks/useFetch";
import {baseUrl} from "../URL";
import {useNavigate, useParams} from "react-router-dom";
import {AddIcon, ChevronLeftIcon} from "@chakra-ui/icons";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Statistics() {

    let navigate = useNavigate()
    const params = useParams();
    const groupCode = params.groupId
    const {data: d, isLoading, error} = useFetch(`${baseUrl}/groups/${groupCode}/statistics`)
    const group = useFetch(`${baseUrl}/groups/${params.groupId}`)

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Doughnut Chart',
                color:'blue',
                font: {
                    size:34
                },
                padding:{
                    top:30,
                    bottom:30
                },
                responsive:true,
                animation:{
                    animateScale: true,
                }
            }
        }

    }

    const data = {
        labels: d.map((o) => o.name),
        datasets: [
            {
                label: 'Money spent by each members',
                data: d.map((o) => o.amountPaid),
                // borderColor: ['rgba(255,206,86,0.2)'],
                backgroundColor: [
                    '#EB6384',
                    '#F6BA09',
                    '#36A2EB',
                    '#9966FF',
                    '#FF9F40',
                    '#336699',
                    '#6201FF',
                    '#38A169',
                    '#E53E3E',
                ],
                pointBackgroundColor: 'rgba(255,206,86,0.2)',
                hoverOffset: 4
            }
        ]
    }

    return (
        // A doughnut chart of who pays most...
        <div className="list">
            <Flex justify='space-between' align='baseline'>
                <Heading as='h1' variant='pageTitle'>Spending trends:</Heading>
                <Button leftIcon={<ChevronLeftIcon />} variant='link' onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Flex>

            <Heading as='h2' variant='pageDetail' marginTop='0.5rem'>Here are spending trends of all members in group {group.data.name}</Heading>

            <Container marginTop='3rem'>
                <Doughnut data={data} options={options} />
            </Container>

            <Text>*) The numbers are amount spent in group's default currency.</Text>
        </div>
    )
}